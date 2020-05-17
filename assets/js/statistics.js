import cards from "./cards";
export {show_results}

let clear_button = document.querySelector('#clear');
let table = document.querySelector('.stat-list');
let add = 'up';

// table sorting
table.addEventListener('click', function (e) {
    if (e.target.tagName === 'I') {
        let card_obj = null;
        let sort_col = e.target.dataset.name.toLowerCase();
        let current_stat = null;
        document.querySelectorAll('.stats_li').forEach(el => {
            if (el.classList.contains('active')) current_stat = el.textContent
        });
        if (sort_col === 'clicks(train)') {
            if (e.target.classList.contains('up')) {
                add = 'down';
                card_obj = cards[current_stat].sort((prev, next) => prev.train_click - next.train_click).reverse();
            } else if (e.target.classList.contains('down')) {
                add = 'up';
                card_obj = cards[current_stat].sort((prev, next) => prev.train_click - next.train_click);
            }
        } else if (sort_col === 'correct') {
            if (e.target.classList.contains('up')) {
                add = 'down';
                card_obj = cards[current_stat].sort((prev, next) => prev.play_correct - next.play_correct).reverse();
            } else if (e.target.classList.contains('down')) {
                add = 'up';
                card_obj = cards[current_stat].sort((prev, next) => prev.play_correct - next.play_correct);
            }
        } else if (sort_col === 'incorrect') {
            if (e.target.classList.contains('up')) {
                add = 'down';
                card_obj = cards[current_stat].sort((prev, next) => prev.play_incorrect - next.play_incorrect).reverse();
            } else if (e.target.classList.contains('down')) {
                add = 'up';
                card_obj = cards[current_stat].sort((prev, next) => prev.play_incorrect - next.play_incorrect);
            }
        } else if (sort_col === 'word') {
            if (e.target.classList.contains('up')) {
                add = 'down';
                card_obj = cards[current_stat].sort((prev, next) => prev.word < next.word ? -1 : 1).reverse();
            } else if (e.target.classList.contains('down')) {
                add = 'up';
                card_obj = cards[current_stat].sort((prev, next) => prev.word < next.word ? -1 : 1);
            }
        } else if (sort_col === 'translation') {
            if (e.target.classList.contains('up')) {
                add = 'down';
                card_obj = cards[current_stat].sort((prev, next) => prev.translation < next.translation ? -1 : 1).reverse();
            } else if (e.target.classList.contains('down')) {
                add = 'up';
                card_obj = cards[current_stat].sort((prev, next) => prev.translation < next.translation ? -1 : 1);
            }
        }
        show_results(card_obj, sort_col);
    }
});

clear_button.addEventListener('click', () => {
    localStorage.removeItem('cards');
    // TODO remove later
    for (let key in cards) {
        for (let obj of cards[key]) {
            obj.train_click = 0;
            obj.play_correct = 0;
            obj.play_incorrect = 0;
        }
    }
    show_results()
});

function show_results(data=cards['Action (set A)'], sort_col=null) {
    let table = document.querySelector('.stat-list');
    table.innerHTML = '';
    table.classList.add('results_table');
    let table_tr_header = document.createElement('tr');
    table_tr_header.classList.add('results_table_header');
    let table_header = ['Word', 'Translation', 'Clicks(train)', 'Correct', 'Incorrect', 'Correct %'];
    table_header.forEach(el => {
        let table_td_header = document.createElement('td');
        let span = document.createElement('span');
        let arrow = document.createElement('i');
        arrow.setAttribute('data-name', el);
        // change the filter arrow with only current target
        if (sort_col === arrow.dataset.name.toLowerCase()) {
            arrow.classList.add(add);
        } else {
            arrow.classList.add('up');
        }
        span.textContent = el;
        // the "correct %" filed isn't instance of cards
        if (!span.textContent.includes('%')) span.append(arrow);
        table_td_header.append(span);
        table_tr_header.append(table_td_header);
        table.append(table_tr_header)
    });

    data.forEach(obj => {
        let play_correct = null;
        let play_incorrect = null;
        let table_tr = document.createElement('tr');
        for (let key in obj) {
            if (!['image', 'audioSrc'].includes(key)) {
                let table_td = document.createElement('td');
                // table_td.classList.add(key);
                if (key === 'play_correct') play_correct = obj[key];
                if (key === 'play_incorrect') play_incorrect = obj[key];
                table_td.textContent = obj[key];
                table_tr.append(table_td)
            }
        }
        let table_td = document.createElement('td');
        table_td.textContent = mistake_rate(play_correct, play_incorrect);
        table_tr.append(table_td);
        table.append(table_tr);
    })
}

function mistake_rate(a, b) {
    let result = (100 / (a + b) * a).toFixed(2);
    return isNaN(result) ? 0 : result;
};