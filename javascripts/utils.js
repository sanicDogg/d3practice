export function getTooltipText (data) {
    let {lastName, lessonNum, grade, semester, topicNum,
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
        + "<br>Семестр: " + semester + "<br>Номер темы: " + topicNumReady
        + "<br>Вид занятия: " + lessonTypeReady
        + "<br>Количество часов: " + hoursCount
        + "<br>Место проведения: " + place + borderControlReady)
}