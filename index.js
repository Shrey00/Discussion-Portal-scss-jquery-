let queData = [];
let resData = [];
let id = 0;
let currentId = 0;
let foundQue;

const appendQuestion = (subject, question, id) => {
    const que = `<h1>${subject}</h1>
    <p>${question}</p>`
    const div = document.createElement('div');
    div.setAttribute('class', 'question');
    div.id = id;
    div.innerHTML = que;
    // $(div).click(() => getQueId());
    $(div).on('click', function (e) {
        showResponses(e);
    });

    $('#que-list-container').append(div);
}
const readData = () => {
    let readQue = JSON.parse(localStorage.getItem('question'))
    if (readQue) {
        queData = readQue;
        $('#que-list-container').empty();
    }
    queData.forEach(que => {
        appendQuestion(que.subject, que.question, que.id);
        ++id;
    });
}
readData();

const writeData = () => {
    localStorage.setItem('question', JSON.stringify(queData));
    // localStorage.setItem('responses', JSON.stringify('responses'));
}


const showNewQuestionForm = () => {
    const newQueForm = `<div id="que-form" class = "user-form">
    <h1>Welcome to Discussion Portal !</h1>
    <p>Enter a subject to get started</p>
    <div class = "input-container" >
        <div class="ele">
            <input name = "subject" id = "subject" class="input" type="text" placeholder="Subject" />
        </div>
        <div class="ele">
            <textarea name = "question" class="input" placeholder="Question"></textarea>
        </div>
        <button onclick = "addQuestion()" id="que-submit" type="button" class="btn btn-primary">Submit</button>
    </div>
</div>`
    $('#ans-container').empty();
    $('#ans-container').append(newQueForm);
}
showNewQuestionForm();


const showResponsePage = (foundQue) => {
    const resPage = `<div id="res-cont">
    <div id="res-que-cont" class = "item-cont">
        <h1 class="heading">Question</h1>
        <div class="question">
            <h1>${foundQue.subject}</h1>
            <p>${foundQue.question}</p>
        </div>
        <div>
            <button onclick = "resolve()" id="resolve-btn" type="button"
                class="btn btn-primary">Resolve</button>
        </div>
    </div>

    <div id="res-response-cont" class = "item-cont">
        <h1 class="heading">Response</h1>
    </div>

    <div class = "user-form" id="add-response-cont" class = "item-cont">
        <h1 class = "heading">Add Response</h1>
        <div class = "input-container">
            <div class="ele">
                <input name="name" id="res-name" class="input" type="text" placeholder="Enter Name" />
            </div>
            <div class="ele">
                <textarea name="comment" id = "res-comment" class="input" placeholder="Enter Comment"></textarea>
            </div>
            <button onclick="addResponse()" id="que-submit" type="button"
                class="btn btn-primary">Submit</button>
        </div>
    </div>
</div>`
    $('#ans-container').empty();
    $('#ans-container').append(resPage);
}

const showResponses = (e) => {
    const searchId = $(e.currentTarget).attr('id');
    console.log(searchId)
    currentId = searchId;
    for (let i = 0; i < queData.length; ++i) {
        if (queData[i].id == searchId) {
            foundQue = queData[i];
            break;
        }
    }
    showResponsePage(foundQue);
    for (let i = 0; i < foundQue.responses.length; ++i) {
        const resp = `<h1>${foundQue.responses[i].name}</h1>
        <p>${foundQue.responses[i].comment}</p>`;
        const div = document.createElement('div');
        div.setAttribute('class', 'response');
        div.innerHTML = resp;
        $('#res-response-cont').append(div);
    }
}

const insertQuestion = (subject, question) => {
    id = ++id;
    const que = `<h1>${subject}</h1>
    <p>${question}</p>`
    const div = document.createElement('div');
    div.setAttribute('class', 'question');
    div.id = id;
    div.innerHTML = que;
    // $(div).click(() => getQueId());
    $(div).on('click', function (e) {
        showResponses(e);
    });

    $('#que-list-container').append(div);
    queData.push({
        id: id,
        subject,
        question,
        responses: [],
    });

    writeData();
}

// const showResponses = () => {

// }



const addQuestion = () => {
    let subject = $('[name = "subject"]').val();
    let question = $('[name = "question"]').val();
    insertQuestion(subject, question);
    // console.log($('#subject').val())
}

const addResponse = () => {
    const name = $('#res-name').val();
    const comment = $('#res-comment').val();
    const resp = `<h1>${name}</h1>
    <p>${comment}</p>`
    const div = document.createElement('div');
    div.setAttribute('class', 'response')
    div.innerHTML = resp;
    $('#res-response-cont').append(div);
    // for (let i = 0; i < queData.length; ++i) {
    // if (queData[i].id == searchId) {
    // foundQue = queData[i];
    // break;
    // }
    // }
    foundQue.responses.push({
        name,
        comment
    })
    writeData();
    // $(div).click(() => getQueId());
    // $(div).on('click', function (e) {
    //     getQueId(e);
    // });
}

// const showResponsePage = (e) => {
//     console.log(e.currentTarget.id)
// }

const resolve = () => {
    showNewQuestionForm();
    let delIndex;
    for (let i = 0; i < queData.length; ++i) {
        console.log(i)
        if (queData[i].id == currentId) {
            delIndex = i;
            break;
        }
    }
    queData.splice(delIndex, 1);
    $('#que-list-container').empty();
    queData.forEach(que => {
        appendQuestion(que.subject, que.question, que.id);
    })
    writeData();
}

const searchQuestion = $('#search-questions');

searchQuestion.on('keyup', (e) => {
    let searchedItems = queData.filter(obj => {
        if (obj.question.toLowerCase().includes(e.target.value.toLowerCase()) || obj.subject.toLowerCase().includes(e.target.value.toLowerCase())) {
            return obj;
        }
    })
    $('#que-list-container').empty();
    if (searchedItems.length === 0)
        $('#que-list-container').append(`<div id = "no-match-text">No match found</div>`)
    if (searchQuestion.value === "") {
        $('#que-list-container').empty();
        queData.forEach(obj => appendQuestion(obj.subject, obj.question, obj.id));
    }
    else
        searchedItems.forEach(obj => appendQuestion(obj.subject, obj.question, obj.id));
})