function getTeks() {
    const formListen = document.getElementById("formSave")
    console.log(quill.root.innerHTML)
    const newArticle = quill.root.innerHTML
    const newInput = document.createElement("input")
    newInput.setAttribute("name", "article")
    newInput.setAttribute("value", newArticle)
    newInput.setAttribute("type", "hidden")
    formListen.appendChild(newInput)
}

function getMessage() {
    const formListen = document.getElementById("formSave")
    console.log(quill.root.innerHTML)
    const newMessage = quill.root.innerHTML
    const newInput = document.createElement("input")
    newInput.setAttribute("name", "message")
    newInput.setAttribute("value", newMessage)
    newInput.setAttribute("type", "hidden")
    formListen.appendChild(newInput)
}