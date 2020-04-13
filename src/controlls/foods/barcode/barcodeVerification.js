module.exports = {
    //(EAN 13)
    VerificationCode(barcode) {
        barcode = barcode.toString()
        barcode.substr(0,1,2,3,4,5,6,7,8,9,10,11)
        let a,b,c,d,e,f,g,h,p,j,k,l
        for(let i = 0; i <= 12; i++){
            switch (i) {
                case 0:
                    a = barcode.charAt(i)
                    break
                case 1:
                    b = barcode.charAt(i)
                    break
                case 2:
                    c = barcode.charAt(i)
                    break
                case 3:
                    d = barcode.charAt(i)
                    break
                case 4:
                    e = barcode.charAt(i)
                    break
                case 5:
                    f = barcode.charAt(i)
                    break
                case 6:
                    g = barcode.charAt(i)
                    break
                case 7:
                    h = barcode.charAt(i)
                    break
                case 8:
                    p = barcode.charAt(i)
                    break
                case 9:
                    j = barcode.charAt(i)
                    break
                case 10:
                    k = barcode.charAt(i)
                    break
                case 11:
                    l = barcode.charAt(i)
                    break
            }
        }
        const code = a * 1 + b * 3 + c * 1 + d * 3 + e * 1 + f * 3 + g * 1 + h * 3 + p * 1 + j * 3 + k * 1 + l * 3
        const remainder = code % 10
        const FindDV = 10 - remainder
        const RealDV = Number(barcode.charAt(12))

        if(FindDV === RealDV) return true
        else return false
            
    }
}