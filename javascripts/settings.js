let selects = document.querySelectorAll("select");
if (localStorage.length > 0)
    selects.forEach(s => {
        s.value = localStorage.getItem(s.name)
    })

document.querySelector(".indexRef").addEventListener("click", () => {
    localStorage.clear();

    let form = document.querySelector("form");
    let formData = new FormData(form);

    localStorage.setItem("students", formData.get("students"));
    localStorage.setItem("lessonType", formData.get("lessonType"));
    localStorage.setItem("topicNum", formData.get("topicNum"));
    localStorage.setItem("chartType", formData.get("chartType"));
    localStorage.setItem("group", formData.get("group"));

    window.location = "index.html";
})