// Создаем класс узлов
class Node {
    constructor(index, value, left, right) {
        this.index = index;
        this.value = value;
        this.left = left;
        this.right = right;
        this.terminalValue = null;
    }
}
// Дерево) 

class Tree {
    constructor(trainingRecords, maxDepth, minSize) {
        // создаем корень дерева на основе наилучшего разбиения для переданных обучающих данных
        this.root = this.getBestSingleSplit(trainingRecords);
        // максимальная глубина дерева
        this.maxDepth = maxDepth;
        // минимальный размер узла дерева
        this.minSize = minSize;
        // разбиваем данные-
        this.splitData();
        // оптимизируем терминалы
        this.optimizeTerminals();
    }

    // метод предсказания класса для записи
    predict(record, node=this.root, path=[]) {
        path.push(node);
        // если значение атрибута узла равно значению атрибута записи, идем влево, иначе вправо
        if (this.match(record.values[node.index], node.value)) {
            // если узел является терминалом, возвращаем его путь
            if (this.isTerminal(node.left)) {
                return path.concat(node.left);
            } else {
                // иначе идем дальше по дереву
                return this.predict(record, node.left, path);
            }
        } else {
            if (this.isTerminal(node.right)) {
                return path.concat(node.right);
            } else {
                return this.predict(record, node.right, path);
            }
        }
    }

    // оптимизация терминальных узлов
    optimizeTerminals(node=this.root) {
        if (this.isTerminal(node)) {
            return node;
        }

        // оптимизируем левую и правую ветви
        node.left = this.optimizeTerminals(node.left);
        node.right = this.optimizeTerminals(node.right);

        // если терминальные узлы левой и правой ветвей равны, то объединяем их
        if (this.terminalsEqual(node)) {
            return node.left;
        }

        return node;
    }

    // проверка равенства терминальных узлов левой и правой ветвей
    terminalsEqual(node) {
        return this.isTerminal(node.left) &&
         this.isTerminal(node.right) &&
         node.left.terminalValue == node.right.terminalValue;
    }

    // разбиваем данные на left and right
    splitData(node=this.root, depth=1) {
        let left = node.left, right = node.right;
       
        // если у левой или правой ветви нет данных, создаем терминальный узел
        if (left.length == 0 || right.length == 0) {
            let terminal = this.makeTerminal(left.concat(right));
            node.left = terminal;
            node.right = terminal;
            return;
        }
    
        // если достигли максимальной глубины, создаем терминальные узлы
        if (depth >= this.maxDepth) {
            node.left = this.makeTerminal(left);
            node.right = this.makeTerminal(right);
            return;
        }
    
        if (left.length <= this.minSize) {
            node.left = this.makeTerminal(left);
        } else {
            node.left = this.getBestSingleSplit(left);
            this.splitData(node.left, depth+1); 
        }
    
        if (right.length <= this.minSize) {
            node.right = this.makeTerminal(right);
        } else {
            node.right = this.getBestSingleSplit(right);
            this.splitData(node.right, depth+1);
        }
    }
    // создания терминальных узлов
    makeTerminal(records) {
        let classesOutcome = this.getClassesArray(records);
        let uniqueClasses = this.getUniqueClasses([records]);
        return this.findBestOutcome(classesOutcome, uniqueClasses);
    }
    
    findBestOutcome(outcome, classes) {
        let bestScore = 0, best = new Node();
        classes.forEach(classVal => {
            let cur = this.classOutcome(outcome, classVal);
            if (cur > bestScore) {
                bestScore = cur;
                best.terminalValue = classVal;
            }
        });
    
        return best;
    }

    classOutcome(outcome, classVal) {
        return outcome.filter(currClassOutcome => currClassOutcome == classVal).length;
    }
    // определения лучшего индекса
    getBestSingleSplit(records) {
        let bestIndex, bestValue, bestScore, bestGroups;
        
        for (let index = 0; index < records[0].values.length; index++) {
            let uniqueValues = this.getUniqueValues(records, index);
            
            uniqueValues.forEach(value => {
                let groups = this.singleSplit(index, value, records);
                let gini = this.giniIndex(groups);
                if (gini < bestScore || bestScore == null) {
                    bestIndex = index;
                    bestValue = value;
                    bestScore = gini;
                    bestGroups = groups;
                }
            });
        }
    
        return new Node(bestIndex, bestValue, bestGroups[0], bestGroups[1]);
    }
    // разделения данных на две группы на основе заданного признака и значения порога.
    singleSplit(attrIndex, attrValue, records) {
        let left = [], right = [];
        records.forEach(record => {
            if (this.match(record.values[attrIndex], attrValue)) {
                left.push(record);
            } else {
                right.push(record);
            }
        });
    
        return [left, right];
    }

    match(actualValue, trueValue) {
        if (!isString(trueValue) && !isString(actualValue)) {
            return actualValue < trueValue;
        } else {
            return actualValue == trueValue;
        }
    }
    // используется для расчета значения критерия Джини
    giniIndex(recordGroups) {
        let classes = this.getUniqueClasses(recordGroups);
        let recordsCount = this.countRecords(recordGroups);
        let gini = 0;
        
        recordGroups.forEach(group => {
            if (group.length == 0) return;
            let score = 0;
    
            classes.forEach(classVal => {
                let proportion = this.getClassProportion(group, classVal);
                score += Math.pow(proportion, 2);
            });
    
            gini += (1 - score) * (group.length / recordsCount);
        });
    
        return gini;
    }
//  Беру значения(Уникальные... (из списка))
    getUniqueValues(records, index) {
        let values = records.map(record => record.values[index]);
        // разделять итерируемые объекты
        return [...new Set(values)];
    }
    
    getUniqueClasses(groups) {
        let classes = [];
        groups.forEach(group => {
            classes = classes.concat(this.getClassesArray(group));
        });
        return [...new Set(classes)];
    }
    
    getClassesArray(records) {
        return records.map(record => record.classValue);
    }

    countRecords(groups) {
        return groups.reduce((count, group) => count + group.length, 0);
    }
    
    getClassProportion(records, classVal) {
        return records.filter(rec => rec.classValue == classVal).length / records.length;
    }
   // проверяем, является ли это листом дерева.
    isTerminal(node) {
        return node.terminalValue != null;
    }
  // 
    logTree(decision='', node=this.root, depth=0) {
        if (!this.isTerminal(node)) {
            let sign = isString(node.value) ? '=' : '<';
            console.log(`${'.'.repeat(depth)}${decision} X${node.index+1} ${sign} ${node.value}`);
            this.logTree(' yes:', node.left, depth+1);
            this.logTree(' no:', node.right, depth+1);
        } else {
            console.log(`${'.'.repeat(depth)}${decision} ${node}`);
        }
    }
}


/*
Разбиение данных на две части: обучающую и тестовую выборки.

Определение критерия ошибки, который будет использоваться для построения дерева. Для задачи классификации часто используется критерий Джини, а для задачи регрессии – критерий MSE (Mean Squared Error).

Определение корневого узла дерева: выбор признака, который будет использоваться для разделения данных на две части. Этот выбор основан на минимизации критерия ошибки.

Разделение данных на две группы на основе выбранного признака и значения порога, который определяет, какие объекты относятся к одной группе, а какие к другой.

Оценка качества разбиения: расчет значения критерия ошибки для каждой из двух групп, которые были получены на предыдущем шаге.

Повторение шагов 3-5 для каждого из полученных на предыдущем шаге узлов до тех пор, пока не будет достигнуто заданное число узлов или пока значения критерия ошибки не станут ниже определенного порога.

Обрезка дерева: удаление ветвей, которые не вносят значительный вклад в повышение качества модели.

Оценка качества модели на тестовой выборке.

Использование построенного дерева для прогнозирования значений целевой переменной на новых данных.*/