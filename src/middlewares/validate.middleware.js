const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        // source вказує, що саме ми перевіряємо: req.body (для POST) чи req.query (для GET)
        const { error } = schema.validate(req[source], { abortEarly: false });

        if (error) {
            // Збираємо всі помилки в один зрозумілий рядок
            const errorMessage = error.details.map((detail) => detail.message).join('; ');
            return res.status(400).json({ 
                message: 'Помилка валідації даних', 
                details: errorMessage 
            });
        }

        next(); // Якщо все ідеально - пропускаємо далі в контролер
    };
};

module.exports = validate;