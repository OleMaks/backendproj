// src/tests/cleanup.test.js
const db = require('../config/db'); // 1. Підключаємо наш модуль бази даних

describe('Database Cleanup Service', () => {
    
    // 3. ОБОВ'ЯЗКОВО закриваємо з'єднання з БД після завершення тесту,
    // інакше термінал "зависне" і тест не завершиться.
    afterAll(async () => {
        await db.end();
    });

    test('should truncate all tables', async () => {
        try {
            // Тимчасово вимикаємо перевірку зовнішніх ключів, 
            // щоб MySQL дозволив нам повністю обнулити таблиці
            await db.execute('SET FOREIGN_KEY_CHECKS = 0');

            // 2. Розкоментовані запити очищення (TRUNCATE скидає також і лічильник ID на 1)
            await db.execute('TRUNCATE TABLE transactions');
            await db.execute('TRUNCATE TABLE categories');

            // Вмикаємо перевірку зовнішніх ключів назад
            await db.execute('SET FOREIGN_KEY_CHECKS = 1');

            console.log('Базу даних успішно очищено!');
            expect(true).toBe(true); // Формальна перевірка для Jest
        } catch (error) {
            console.error('Помилка під час очищення бази даних:', error);
            throw error;
        }
    });
});