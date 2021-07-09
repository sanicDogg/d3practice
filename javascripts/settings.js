document.querySelector(".indexRef").addEventListener("click", () => {
    let form = document.querySelector("form");

    let formData = new FormData(form);
    let studentsValue = formData.get("students")
    // localStorage.setItem("students", studentsValue);
    // console.log(formData.get("students"))

    // window.location = "index.html";
})