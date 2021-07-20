export function prepareDataLinear(data) {
    // Если нужно отобразить график для одного студента
    let student = getStudentLastName(Number(localStorage.getItem("students")));

    // Список студентов
    let students = Array.from(new Set(data.map(item => item.lastName)))

    if (student) students = [student];

    // Подготовка данных
    let temp = students.map(student => {
        return {
            name: student,
            values: data.filter((d) =>
                getFilterExpression(d, student)
            )
        }
    });

    let dataReady = temp.filter(el => el.values.length > 0);

    return {students: students, dataReady: dataReady}
}

export function prepareDataBarplot(data) {
    // Если нужно отобразить график для одного студента
    let lastName = getStudentLastName(Number(localStorage.getItem("students")));
    let lessonNums = Array.from(new Set(data.map(item => item.lessonNum)));

    let studyGroup = getStudentGroup(Number(localStorage.getItem("group")));
    let students;
    // Если указана группа, находим студентов этой группы
    if (studyGroup) {
        let set = new Set(data.map(item => {
            if (item.group === studyGroup) return item.lastName;
        }));
        set.delete(undefined);
        students = Array.from(set);
    } else
        students = Array.from(new Set(data.map(item => item.lastName)));

    if (lastName) students = [lastName];

    let preparedData = [];

    for (let i = 1; i <= lessonNums.length; i++) {
        let filteredData = data.filter(student =>
             student.lessonNum === i && getFilterExpression(student, lastName));
        // Если нет подходящих студентов, прекращаем итерацию
        if (filteredData.length === 0) continue;

        let obj = {group: i}
        filteredData.forEach(student => {
            obj[student.lastName] = student.grade;
        });
        preparedData.push(obj)
    }

    return { subgroups: students, groups: lessonNums, preparedData: preparedData }
}

export function getTooltipText (data) {
    let {lastName, group, lessonNum, grade, semester, topicNum,
        lessonType, hoursCount, place, borderControl} = data;

    let lessonTypeReady = lessonType;
    switch (lessonType){
        case "Л":
            lessonTypeReady = "Лекция"
            break;
        case "КЗ":
            lessonTypeReady = "Контрольное занятие"
            break;
        case "ПЗ":
            lessonTypeReady = "Практическое занятие"
            break;
        case "ГЗ":
            lessonTypeReady = "Групповое занятие"
            break;
    }

    let topicNumReady = topicNum === "В" ? "Вводное занятие" : topicNum;

    let borderControlReady =
        borderControl === "-" ? "" : "<br>Рубежный контроль: " + borderControl;

    return ("<span class='highlighted'>Cтудент: " + lastName + "<br>Номер занятия: " + lessonNum + "<br>Оценка: " + grade + "</span>"
        + "<br>Группа: " + group
        + "<br>Семестр: " + semester + "<br>Номер темы: " + topicNumReady
        + "<br>Вид занятия: " + lessonTypeReady
        + "<br>Количество часов: " + hoursCount
        + "<br>Место проведения: " + place + borderControlReady)
}

function getFilterExpression(d, studentLastName) {
    let lastNameExpression = d.lastName === studentLastName;
    if (!studentLastName) lastNameExpression = true;

    let lessonType = getLessonType(Number(localStorage.getItem("lessonType")));
    let lessonTypeExpression = d.lessonType === lessonType;
    if (!lessonType) lessonTypeExpression = true;

    let topicNum = getTopicNum(Number(localStorage.getItem("topicNum")));
    let topicNumExpression = d.topicNum === topicNum;
    if (!topicNum) topicNumExpression = true;

    let studyGroup = getStudentGroup(Number(localStorage.getItem("group")));
    let studyGroupExpression = studyGroup === d.group;
    if (!studyGroup) studyGroupExpression = true;

    return lastNameExpression && studyGroupExpression && lessonTypeExpression && topicNumExpression;
}


function getStudentLastName(index) {
    switch (index) {
        case 0:
            return false
        case 1:
            return "Табакин"
        case 2:
            return "Иванов"
        case 3:
            return "Петров"
        case 4:
            return "Сидоров"
    }
}

function getStudentGroup(index) {
    switch (index) {
        case 0:
            return false
        case 1:
            return "5262"
        case 2:
            return "5363"
        case 3:
            return "5372"
        case 4:
            return "5373"
    }
}

function getLessonType(index) {
    switch (index) {
        case 0:
            return false
        case 1:
            return "Л"
        case 2:
            return "ПЗ"
        case 3:
            return "ГЗ"
        case 4:
            return "КЗ"
    }
}

function getTopicNum(index) {
    switch (index) {
        case 0:
            return false
        case 1:
            return "В"
        case 2:
            return "1"
        case 3:
            return "2"
        case 4:
            return "3"
        case 5:
            return "4"
    }
}