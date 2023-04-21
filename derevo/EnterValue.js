class Record {
    constructor(recString, isTraining) {
        let recArray = this.splitString(recString);
        this.values = this.parseNums(isTraining ? recArray.slice(0, recArray.length - 1) : recArray);
        this.classValue = isTraining ? recArray[recArray.length - 1] : null;
    }
// splitString разбивает строку на массив строк по запятым
    splitString(recString) {
        let splitReg = /(?<=^|,)(\"(?:[^\"])*\"|[^,]*)/g;
        return recString.match(splitReg);
    }
// parseNums преобразует массив строк в массив чисел
    parseNums(strArray) {
        return strArray.map(str => {
            let parsed = parseFloat(str);
            return isNaN(parsed) ? str.trim() : parsed;
        });
    }
}
//Функция convertCsvToRecords принимает csvData и 
// isTraining в качестве аргументов и возвращает массив объектов Record.
function convertCsvToRecords(csvData, isTraining) {
    //  Она удаляет все символы переноса строки из csvData и затем разбивает его на массив строк 
    //stringRecords по символу переноса строки. Затем она создает объект Record для каждой строки 
    //stringRecords и добавляет его в массив records.
    let stringRecords = csvData.replaceAll('\r', '');
    stringRecords = stringRecords.split("\n");
    let records = stringRecords.map(rec => new Record(rec, isTraining));
    if (records[records.length-1].values[0] == "") {
        records.pop();
    }

    for (let i = 0; i < records[0].values.length; i++) {
        let allNums = true;
        records.forEach(record => {
            if (isString(record.values[i])) {
                allNums = false;
                return;
            }
        });

        if (!allNums) {
            records.forEach(record => {
                record.values[i] = record.values[i].toString();
            });
        }
    }

    return records;
}
// Функция isString принимает значение value в качестве аргумента и возвращает true,
// если значение value является строкой.
function isString(value) {
    return typeof value == "string";
}