// showFileMessage(msg): эта функция устанавливает innerHTML всех элементов с классом 'dataInfo' для данного сообщения.
function showFileMessage(msg) {
    let dataInfos = document.getElementsByClassName('dataInfo');
    for (let i = 0; i < dataInfos.length; i++) {
        dataInfos[i].innerHTML = msg; 
    }
}
// отображение двух элементов пользовательского интерфейса
function toggleInputUi(isChecked) {
    let fileInput = document.getElementsByClassName('fileInputContainer')[0];
    let textInput = document.getElementsByClassName('textInputContainer')[0];
    if (isChecked) {
        fileInput.style.display = 'none';
        textInput.style.display = 'block';
    } else {
        fileInput.style.display = 'block';
        textInput.style.display = 'none';
    }
}

// очищает содержимое данного элемента дерева пользовательского интерфейса.
function clearTree(uiTree) {
    uiTree.innerHTML = '';
}
//эта функция рекурсивно рисует дерево решений для заданного элемента пользовательского интерфейса, 
// используя неупорядоченные списки HTML для представления узлов и ребер дерева.
function drawTree(node, ulParent) {
    predictBtn.disabled = false;
    
    let li = document.createElement('li');
    let span = document.createElement('span');

    let spanText;
    if (!tree.isTerminal(node)) {
        let sign = isString(node.value) ? '=' : '<';
        spanText = `X${node.index+1} ${sign} ${node.value}`;
    } else {
        spanText = `${node.terminalValue}`;
    }

    span.innerHTML = spanText;
    li.appendChild(span);
    ulParent.appendChild(li);
    node.domElement = span;

    if (tree.isTerminal(node)) {
        return;
    } else {
        let ul = document.createElement('ul');
        li.appendChild(ul);
        drawTree(node.left, ul);
        drawTree(node.right, ul);
    }
}

// Обновляет список.
function updateResultsUiList(uiList, results) {
    refreshList(uiList);
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        updateDom(result);
        uiList.appendChild(result.domElement);
    }    
}
// Очищает  элем. списка ипользовательского интерфейся  и + к нему new заголовок.
function refreshList(uiList) {
    uiList.innerHTML = '';
    let h2 = document.createElement('h2');
    h2.innerHTML = 'Результаты';
    uiList.appendChild(h2);
}
// Обновнляем doom
function updateDom(result) {
    const li = result.domElement;

    li.innerHTML = result.path[result.path.length - 1].terminalValue;
    li.addEventListener('click', () => chooseResultCallback(result));
}
// Берем результат 
function chooseResultCallback(result) {
    const li = result.domElement;

    if (isAnimating == false) {
        currentChosenElement.classList.remove('chosen');
        li.classList.add('chosen');
        currentChosenElement = li;
        animatePrediction([result]);
    }
}

// Анимируем
async function animatePrediction(results) {
    toggleAnimationFlags();

    clearUiNodesColors();
    await drawPredictedPath(results[0].path);
    for (let i = 1; i < results.length; i++) {
        clearPathBackgrounds(results[i-1].path);
        await drawPredictedPath(results[i].path);
    }

    toggleAnimationFlags();
}
// Запускаем цикл
async function drawPredictedPath(path) {
    await sleep(250);
    for (let i = 0; i < path.length; i++) {
        toggleBackground(path[i]);
        await sleep(250);
    }
}
// Изменяем фон
function toggleBackground(node) {
    if (tree.isTerminal(node)) {
        node.domElement.classList.toggle('coloredTerminal');
    } else {
        node.domElement.classList.toggle('colored');
    }
}
// Очищаем пользовательский интерфейс 
function clearUiNodesColors(node=tree.root) {
    removeBackground(node);
    if(tree.isTerminal(node)) return;

    clearUiNodesColors(node.left);
    clearUiNodesColors(node.right);
}

// Удаляем фон
function removeBackground(node) {
    node.domElement.classList.remove('coloredTerminal');
    node.domElement.classList.remove('colored');
}
// Очищаем фон пути 
function clearPathBackgrounds(nodes) {
    for (let i = 0; i < nodes.length; i++) {
        removeBackground(nodes[i]);
    }
}

// Отпрявлем программу спать 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Переключаем флаг анимации 
function toggleAnimationFlags() {
    predictBtn.disabled = !predictBtn.disabled;
    isAnimating = !isAnimating;
}
