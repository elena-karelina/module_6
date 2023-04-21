const inputSwitch = document.getElementById('inputTypeSwitch'); // Ручной ввод
const upload = document.getElementById('upload');
const textInput = document.getElementById('textInput');
const createTreeBtn = document.getElementById("start");
const predictBtn = document.getElementById("clear");
const resultList = document.getElementsByClassName('pathsList')[0];
const maxDepth = 8;
const minSize = 1;

var csvString;
var tree;
var predictedResults = [];
var currentChosenElement = null;
var isAnimating = false;

createTreeBtn.addEventListener('click', createTree);
predictBtn.addEventListener('click', predict);
inputSwitch.addEventListener('change', changeInputType);
upload.addEventListener('change', tryParseFile);
textInput.addEventListener('change', updateStringData);

// создает дерево решений на основе данных, предоставленных в формате CSV;
function createTree() {
    if (invalidData(csvString)) return;

    let trainingRecords = convertCsvToRecords(csvString, true);
    tree = new Tree(trainingRecords, maxDepth, minSize);
    var uiTree = document.getElementsByClassName('tree')[0];

    clearTree(uiTree);
    refreshList(resultList);
    drawTree(tree.root, uiTree);
}
// прогнозирует результаты на основе дерева решений и данных, предоставленных в формате CSV;
function predict() {
    if (invalidData(csvString)) return;

    if (typeof(tree) == undefined || tree == null) {
        showFileMessage('Отсутствует дерево решений')
        return;
    }

    let records = convertCsvToRecords(csvString);
    updateResults(records);
    updateResultsUiList(resultList, predictedResults);

    currentChosenElement = predictedResults[0].domElement;
    currentChosenElement.classList.add('chosen');

    animatePrediction([predictedResults[0]]);
}
// обновляет массив результатов прогнозирования на основе данных.
function updateResults(records) {
    predictedResults = [];
    for (let i = 0; i < records.length; i++) {
        const result = {
            domElement: document.createElement('li'),
            path: tree.predict(records[i]),
        };
        predictedResults.push(result);
    }
}
// обновляет пользовательский интерфейс в зависимости от выбранного типа ввода (текст или файл)
function changeInputType() {
    toggleInputUi(inputSwitch.checked);
    toggleInputData(inputSwitch.checked);
}
// переключает ввод данных между текстом и файлом в зависимости от выбранного типа ввода;
function toggleInputData(isChecked) {
    if (isChecked) {
        updateStringData();
    } else {
        tryParseFile();
    }
}
// обновляет строку данных на основе пользовательского ввода
function updateStringData() {
    csvString = textInput.value;
    let message = "";
    if (csvString.length == 0) {
        message = "Нет данных";
    } else {
        message = csvString.slice(0, Math.min(10, csvString.length));
        message += csvString.length > 10 ? "..." : "";
    }
    showFileMessage(message);
}
// читает и обработать файл, загруженный пользователем;
function tryParseFile() {
    let files = upload.files;
    if (files.length == 0) {
        showFileMessage("Файл не выбран");
        return;
    }
    if (!validFileType(files[0])) {
        showFileMessage("Неверный тип файла");
        return;
    }
    showFileMessage(files[0].name);
    parseFile(files[0]);
}
// разбирает загруженный файл и обновляет переменную csvString
function parseFile(file) {
    let reader = new FileReader;
    reader.onload = function(){
        csvString = reader.result;
    }
    reader.readAsText(file);
}
// Данный код содержит две функции: validFileType и invalidData. 
//Функция validFileType принимает файл в качестве аргумента и возвращает true,
// если тип файла соответствует одному из типов в массиве fileTypes, иначе возвращает false
function validFileType(file) {
    let fileTypes = ["text/plain", ""];
    for (let i = 0; i < fileTypes.length; i++) {
        if (fileTypes[i] == file.type) {
            return true;
        }
    }
    return false;
}

// Функция invalidData принимает данные в качестве аргумента и возвращает true, 
//если данные не определены или равны null или имеют длину 0, иначе возвращает false.
function invalidData(data) {
    if (typeof(data) == undefined || data == null || data.length == 0) {
        showFileMessage('Недостаточно данных');
        return true;
    }
}
