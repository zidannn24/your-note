const API_URL = 'http://localhost:3000/notes'

fetchData()

async function fetchData(){
    const res = await fetch(API_URL)
    const data = await res.json()
    const notesContainer = document.getElementById('notes-container')
    notesContainer.innerHTML = ''
    data.forEach(note =>{
        const noteCard = document.createElement('div')
        noteCard.classList.add('note-card')

        const title = document.createElement('h1')
        title.classList.add('title')
        title.innerHTML = note.title

        const content = document.createElement('p')
        content.classList.add('content')
        content.innerHTML = note.content

        const fullDate = document.createElement('p')
        fullDate.classList.add('date')
        fullDate.innerHTML = `Created on: ${note.date}`

        const editButton = document.createElement('button')
        editButton.classList.add('edit-btn')
        editButton.textContent = 'Edit'
        editButton.onclick = (event) => {
            event.preventDefault();
            getDataToEdit(note)
            const editCardPreview = document.querySelector('.edit-card-preview')
            editCardPreview.classList.toggle('active')

            document.getElementById('cancel-edit-btn').addEventListener('click', (event)=>{
                event.preventDefault();
                editCardPreview.classList.remove('active')
            })
        }
        
        const deleteButton = document.createElement('button')
        deleteButton.classList.add('delete-btn')
        deleteButton.textContent = 'Delete'
        deleteButton.onclick = () => deleteNote(note.id)

        noteCard.appendChild(title)
        noteCard.appendChild(content)
        noteCard.appendChild(fullDate)
        noteCard.appendChild(editButton)
        noteCard.appendChild(deleteButton)
        notesContainer.appendChild(noteCard)
    })
}

document.getElementById('submit-btn').addEventListener('click', (event)=>{
    event.preventDefault();
    addNote()
})

async function addNote(){
    const inputTitle = document.getElementById('input-title').value
    const inputContent = document.getElementById('input-content').value
    const getDate = new Date();
    const formattedDate = `${getDate.getDate()}-${getDate.getMonth() + 1}-${getDate.getFullYear()} ${getDate.getHours()}:${getDate.getMinutes()}`;
    if(inputTitle && inputContent){
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                title: inputTitle,
                content: inputContent,
                date: formattedDate
            })
        })
        fetchData()
    }
}

function getDataToEdit(note){
    const editTitle = document.getElementById('edit-title')
    const editContent = document.getElementById('edit-content')

    editTitle.value = note.title
    editContent.value = note.content

    const submitEditButton = document.getElementById('submit-edit-btn')
    submitEditButton.addEventListener('click', ()=>{
        editNote(note.id)
    })
}

async function editNote(id) {
    const editTitle = document.getElementById('edit-title').value
    const editContent = document.getElementById('edit-content').value
    const getDate = new Date();
    const formattedDate = `${getDate.getDate()}-${getDate.getMonth() + 1}-${getDate.getFullYear()} ${getDate.getHours()}:${getDate.getMinutes()} (Edited)`;
    if(editTitle && editContent){
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                title: editTitle,
                content: editContent,
                date: formattedDate
            })
        })
        fetchData()
    }
}

async function deleteNote(id){
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    fetchData()
}