import { todos,Todo,saveToStorage, completedTodos } from "./main.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

const titleInput = document.querySelector('.todo-title')
const descriptionInput = document.querySelector('.todo-description')
const createButton = document.querySelector('.create-button')

const low = document.querySelector('.low')
const medium = document.querySelector('.medium')
const high = document.querySelector('.high')

const notStarted = document.querySelector('.not-started')
const inProgress = document.querySelector('.in-progress')
const completed = document.querySelector('.completed')

const nonVital = document.querySelector('.non-vital')


function addTodo() {
    createButton.addEventListener('click',() => {
        const title = titleInput.value
        const description = descriptionInput.value
        let priority = undefined;
        let status = undefined;
        let vital = undefined;
        low.checked ? priority = 'low' : priority = priority
        medium.checked ? priority = 'medium' : priority = priority
        high.checked ? priority = 'high' : priority = priority
        

        notStarted.checked ? status = 'not started' : status = status
        inProgress.checked ? status = 'in progress' : status = status
        completed.checked ? status = 'completed' : status = status

        nonVital.checked ? vital = false : vital = true
        
        
        const todoDetails = {
            title,
            description,
            priority,
            status,
            creationDate: dayjs().format('DD/MM/YY'),
            vital,
        }
        completed.checked? completedTodos.push(todoDetails) : todos.push(todoDetails)
        console.log(todos)
        console.log(completedTodos)
        

        saveToStorage()
        
    })
}
addTodo()