module.exports = {
    calculate(carbohydrate, totalfat, protein) {
        carbohydrate = carbohydrate * 4
        totalfat = totalfat * 9
        protein = protein * 4
        return Kcal = carbohydrate + totalfat + protein
    }
}