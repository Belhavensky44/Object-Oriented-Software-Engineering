
import axios from "axios";
import fs from "fs/promises";

// НАСТРОЙКИ
const QUERY = "перчатки";
const amountPages = 3;

const BASE_DELAY = 5000;  
const MAX_RETRIES = 3;      
const headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "*/*"
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//  ЗАПРОС ОДНОЙ СТРАНИЦЫ 
async function getProducts(numPage, attempt = 1) {
    const url =
        `https://search.wb.ru/exactmatch/ru/common/v5/search` +
        `?query=${encodeURIComponent(QUERY)}` +
        `&sort=price_desc` +
        `&page=${numPage}` +
        `&resultset=catalog` +
        `&appType=1` +
        `&curr=rub` +
        `&dest=-1257786`;

    try {
        const res = await axios.get(url, { headers });
        const data = res.data;

        if (numPage === 1 && attempt === 1) {
            console.log("Всего найдено товаров:", data.metadata?.total);
        }

        return data.data?.products || [];
    } catch (err) {
        const status = err.response?.status;

        if (status === 429 && attempt <= MAX_RETRIES) {
            const retryAfter =
                Number(err.response?.headers?.["retry-after"]) * 1000 ||
                BASE_DELAY * attempt;

            console.log(
                `429 Too Many Requests (страница ${numPage}), ` +
                `повтор ${attempt}/${MAX_RETRIES}, ` +
                `ожидание ${retryAfter / 1000} сек`
            );

            await delay(retryAfter);
            return getProducts(numPage, attempt + 1);
        }

        console.log(
            "Ошибка при загрузке страницы",
            numPage,
            err.message
        );
        return [];
    }
}

//  ОСНОВНАЯ ЛОГИКА 
async function main() {
    let allProducts = [];

    for (let numPage = 1; numPage <= amountPages; numPage++) {
        console.log("Загружается страница", numPage);

        const products = await getProducts(numPage);
        console.log("Товаров на странице:", products.length);

        allProducts = allProducts.concat(products);

        console.log(`Пауза ${BASE_DELAY / 1000} сек...\n`);
        await delay(BASE_DELAY);
    }

    console.log("Всего собрано товаров:", allProducts.length);

    //  ПРЕОБРАЗОВАНИЕ ДАННЫХ
    const result = allProducts.map(p => ({
        brand: p.brand,
        name: p.name,
        feedbacks: p.feedbacks,
        supplierRating: p.supplierRating,
        link: `https://www.wildberries.ru/catalog/${p.id}/detail.aspx`,
        priceCurrent: (p.sizes?.[0]?.price?.product || 0) / 100,
        priceBase: (p.sizes?.[0]?.price?.basic || 0) / 100,
        characteristics: {
            color: p.colors?.[0]?.name || "нет данных",
            category: p.subjectName || "нет данных",
            quantity: p.totalQuantity || "нет данных",
            volume: p.volume || "нет данных"
        }
    }));

    //  ЗАПИСЬ В ФАЙЛ 
    try {
        await fs.writeFile(
            "products.json",
            JSON.stringify(result, null, 2),
            "utf8"
        );
        console.log("Файл products.json сохранён");
    } catch (e) {
        console.log("Ошибка при записи файла:", e.message);
    }
}


main();

