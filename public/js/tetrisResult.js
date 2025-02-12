let dropInterval;
let scoreValue = 0;
let tempScoreValue = 0;
let moveContentTopValue;
let levelUp = 500;
let btnValue = false;
let tableBody = $('#tableBody')[0];
let tempContentValue;
let randomCountA = 0;
let randomCountB = 0;
let randomCountArray = [];
let userName = "";
let rankToggle = true;
//create table
function makeStage() {
    let rowsBox = 20;
    let columnBox = 10;
    let tempTable = '';
    for (let i = 0; i < rowsBox; i++) {
        tempTable += '<tr>';
        for (let j = 0; j < columnBox; j++) {
            tempTable += '<td></td>';
        }
        tempTable += '</tr>';
    }
    $('.tableBody').html(tempTable);
}
makeStage();
//contentArray
const contentObjects = {
    iContent: [
        [[0, 0], [0, 1], [0, 2], [0, 3]],
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[0, 0], [0, 1], [0, 2], [0, 3]],
        [[0, 0], [1, 0], [2, 0], [3, 0]]
    ],
    oContent: [
        [[0, 0], [0, 1], [1, 0], [1, 1]],
        [[0, 0], [0, 1], [1, 0], [1, 1]],
        [[0, 0], [0, 1], [1, 0], [1, 1]],
        [[0, 0], [0, 1], [1, 0], [1, 1]]
    ],
    zContent: [
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [0, 1], [0, 2]],
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [0, 1], [0, 2]]
    ],
    sContent: [
        [[1, 0], [2, 0], [0, 1], [1, 1]],
        [[0, 0], [0, 1], [1, 1], [1, 2]],
        [[1, 0], [2, 0], [0, 1], [1, 1]],
        [[0, 0], [0, 1], [1, 1], [1, 2]]
    ],
    jContent: [
        [[0, 2], [1, 0], [1, 1], [1, 2]],
        [[0, 0], [0, 1], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [2, 0], [1, 2]],
        [[0, 0], [1, 0], [2, 0], [2, 1]]
    ],
    lContent: [
        [[0, 0], [0, 1], [0, 2], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [2, 0]],
        [[0, 0], [1, 0], [1, 1], [1, 2]],
        [[0, 0], [0, 1], [1, 0], [2, 0]]
    ],
    tContent: [
        [[2, 1], [0, 1], [1, 0], [1, 1]],
        [[2, 1], [1, 2], [1, 0], [1, 1]],
        [[1, 2], [0, 1], [2, 1], [1, 1]],
        [[1, 2], [0, 1], [1, 0], [1, 1]],

    ]
}
//초기 설정
const moveContent = {
    type: "",
    direction: 0,
    top: 0,
    left: 3,
};
function init() {
    $('.cover').css('display', 'none');
    tempContentValue = { ...moveContent };
    renderContent();
}
//randomCountFunc
function randomCountFunc() {
    randomCountA = parseInt(Math.random() * 7);
    randomCountB = parseInt(Math.random() * 7);
    randomCountArray.push(randomCountA, randomCountB);
}
randomCountFunc();
//randomContent
function randomContent() {
    let randomContentNumber = randomCountArray.shift();
    let tempContentKeys = Object.keys(contentObjects);
    moveContent['type'] = tempContentKeys[randomContentNumber];
    switch (randomCountArray[0]) {
        case 0: $('.nextContent').html('<img src="./img/iContent[0].png" class="nextTetris" alt="tetris">');
            break;
        case 1: $('.nextContent').html('<img src="./img/oContent[1].png" class="nextTetris" alt="tetris">');
            break;
        case 2: $('.nextContent').html('<img src="./img/zContent[2].png" class="nextTetris" alt="tetris">');
            break;
        case 3: $('.nextContent').html('<img src="./img/sContent[3].png" class="nextTetris" alt="tetris">');
            break;
        case 4: $('.nextContent').html('<img src="./img/jContent[4].png" class="nextTetris" alt="tetris">');
            break;
        case 5: $('.nextContent').html('<img src="./img/lContent[5].png" class="nextTetris" alt="tetris">');
            break;
        case 6: $('.nextContent').html('<img src="./img/tContent[6].png" class="nextTetris" alt="tetris">');
            break;
        default:
            break;
    }
}
randomContent();
//start, stop btn
$('#startBtn').click(() => {
    if ($('.userName').html() !== 'ID를 입력하세요') {
        init();
        if ($('#startBtn').html() == 'START') {
            $('#startBtn').blur();
            $('.gameOver').css('display', 'none');
            btnValue = true;
            moveContentTop();
            $('#startBtn').html('STOP');
        } else {
            $('#startBtn').blur();
            $('.gameOver').css('display', 'block');
            clearInterval(moveContentTopValue);
            btnValue = false;
            $('#startBtn').html('START');
        }
    } else {
        $('#idModalBox').css('display', 'block');
    }
});

$('#idModalBoxClose').click(() => {
    $('#idModalBox').css('display', 'none');
});
//renderContent
function renderContent(moveType = '') {
    const { type, direction, top, left } = tempContentValue;
    let removeClassAll = document.querySelectorAll('.moveContent');
    removeClassAll.forEach(value => {
        value.classList.remove(type, 'moveContent');
    });
    contentObjects[type][direction].some(value => {
        let moveX = value[0] + left;
        let moveY = value[1] + top;
        let drawContentBox = tableBody.childNodes[moveY] ?
            tableBody.childNodes[moveY].childNodes[moveX] : null;
        if (checkDrawContentBox(drawContentBox)) {
            drawContentBox.classList.add(type, 'moveContent');
        } else {
            tempContentValue = { ...moveContent };
            setTimeout(() => {
                if (moveType == 'gameOver') {
                    clearInterval(moveContentTopValue);
                    btnValue = false;
                    $('.gameOver').css('display', 'block');
                    $('.gameOverResetBtn').css('display', 'block');
                    $('.gameOverText').css('display', 'block');
                } else {
                    renderContent('gameOver');
                    ajaxRankResult();
                }
                if (moveType == 'top') {
                    freezeFunc();
                    deleteContent();
                    randomCountArray.push(parseInt(Math.random() * 7));
                    randomContent();
                    newContent();
                    ajaxRankResult();
                }
            }, 0);
            return true;
        }
    });
    moveContent.top = top;
    moveContent.left = left;
    moveContent.direction = direction;
}
//deleteContent
function deleteContent() {
    tempScoreValue = 0;
    for (let i = 0; i < 20; i++) {
        let freezeCount = 0;
        for (let j = 0; j < 10; j++) {
            if (tableBody.childNodes[i].childNodes[j].classList.contains('freeze')) {
                freezeCount++;
                if (freezeCount == 10) {
                    deleteContentRemove(i);
                }
            }
        }
    }
    if (tempScoreValue == 1) {
        tempScoreValue = 10;
        lightScore1Combo();
    } else if (tempScoreValue == 2) {
        tempScoreValue = 30;
        lightScore2Combo();
    } else if (tempScoreValue == 3) {
        tempScoreValue = 50;
        lightScore3Combo();
    } else if (tempScoreValue == 4) {
        tempScoreValue = 100;
        lightScore4Combo();
    }
    scoreValue += tempScoreValue;
    $('#scoreValue').html(changeValue(scoreValue));
    $('#myRankScore2').html(changeValue(scoreValue));
    levelUpFunc(scoreValue);
}
//lightScore
function lightScore1Combo() {
    $('.score').css('color', 'yellow');
    setTimeout(() => {
        $('.score').css('color', 'white');
    }, 100)
}
function lightScore2Combo() {
    $('.score').css('color', 'green');
    setTimeout(() => {
        $('.score').css('color', 'white');
    }, 100)
}
function lightScore3Combo() {
    $('.score').css('color', 'blue');
    setTimeout(() => {
        $('.score').css('color', 'white');
    }, 100)
}
function lightScore4Combo() {
    $('.score').css('color', 'red');
    setTimeout(() => {
        $('.score').css('color', 'white');
    }, 100)
}
//deleteContentRemove
function deleteContentRemove(forNumA) {
    tableBody.childNodes[forNumA].remove();
    tempScoreValue++;
    createTable();
}
//createTable
function createTable() {
    let newTable = "<tr>";
    for (let i = 0; i < 10; i++) {
        newTable += "<td></td>";
    }
    newTable += "</tr>";
    $('#tableBody').prepend(newTable);
}
//newContent
function newContent() {
    clearInterval(dropInterval);
    moveContentTop();
    moveContent.top = 0;
    moveContent.left = 4;
    moveContent.direction = 0;
    tempContentValue = { ...moveContent };
    renderContent();
}
//고정시키기
function freezeFunc() {
    removeClassAll = document.querySelectorAll('.moveContent');
    removeClassAll.forEach(value => {
        value.classList.remove('moveContent');
        value.classList.add('freeze');
    });

}
//check drawContentBox
function checkDrawContentBox(value) {
    if (!value || value.classList.contains('freeze')) {
        return false;
    } else {
        return true;
    }
}
//moveContent
function moveContentFunc(directionValue, amount) {
    if (btnValue) {
        let moveType;
        moveType = directionValue;
        tempContentValue[directionValue] += amount;
        renderContent(moveType);
    }
}
//keypress
$(this).keydown((e) => {
    switch (e.key) {
        case 'ArrowLeft':
            moveContentFunc('left', -1);
            lightKey('.leftKey');
            break;
        case 'ArrowUp':
            RotateChangeCount();
            lightKey('.upKey');
            break;
        case 'ArrowRight':
            moveContentFunc('left', 1);
            lightKey('.rightKey');
            break;
        case 'ArrowDown':
            moveContentFunc('top', 1);
            lightKey('.downKey');
            break;
        case ' ':
            moveContentTopDrop();
            lightKey('.spacebarKey');
            break;
        default:
            break;
    }
});
//light key
function lightKey(value) {
    $(value).css('opacity', 0.5);
    setTimeout(() => {
        $(value).css('opacity', 1);
    }, 70);
}
//Rotate count reset
function RotateChangeCount(value) {
    if (btnValue) {
        tempContentValue['direction'] += 1;
        if (tempContentValue['direction'] == 4) {
            tempContentValue['direction'] = 0;
        }
        renderContent();
    }
}
//moveContentTop+1
function moveContentTop() {
    clearInterval(moveContentTopValue);
    moveContentTopValue = setInterval(() => {
        moveContentFunc('top', 1);
    }, levelUp);
}
//moveContentTopFast
function moveContentTopDrop() {
    clearInterval(moveContentTopValue);
    clearInterval(dropInterval);
    if (btnValue) {
        dropInterval = setInterval(() => {
            moveContentFunc('top', 1);
        }, 5);
    }
}
//level
function levelUpFunc(value) {
    if (150 < value && value < 300) {
        levelUp = 400;
        $('.levelValue').html('2');
    } else if (300 < value && value < 450) {
        levelUp = 300;
        $('.levelValue').html('3');
    } else if (450 < value && value < 600) {
        levelUp = 200;
        $('.levelValue').html('4');
    } else if (600 < value) {
        levelUp = 100;
        $('.levelValue').html('5');
    }
}
$('#resetBtn').click(() => {
    location.reload();
});
$('.gameOverResetBtn').click(() => {
    location.reload();
});
//천 단위
function changeValue(value) {
    let tempArray = [];
    let tempResultArray = [];
    let tempValue = value.toString();
    let resultValue = '';
    for (let i = 0; i < tempValue.length; i++) {
        tempArray[i] = tempValue[i];
    }
    for (let i = 0; i < tempValue.length; i++) {
        let tempArrayPop = tempArray.pop();
        if (i % 3 == 0 && i != 0) {
            tempResultArray.unshift(',');
        }
        tempResultArray.unshift(tempArrayPop);
    }
    resultValue = tempResultArray.join('');
    return resultValue;
}
$('#userNameBtn').click(() => {
    userName = $('.userNameText').val();
    if (userName == '') {
        $('#idModalBox').css('display', 'block');
    } else {
        $.ajax({
            url: "/userDB",
            type: "POST",
            dataType: "JSON",
            data: { "userName": userName }
        })
            .done((json) => {
                let userName = json.userNameValue;
                $('.userName').html(`환영합니다. ${userName} 님!`);
                $('#bestScoreValue').html(changeValue(json.bestScoreValue));
                $('#myRankScore1').html(`${userName}`);
                $('#myRankScore3').html(changeValue(json.bestScoreValue));
            })
            .fail((xhr, status, errorThrown) => {
                console.log("Ajax failed");
            });
        $('.userNameBox').css('display', 'none');
    }
});
$('#rankBtn').click(() => {
    $('#rankBtn').blur();
    if (rankToggle) {
        $('#rankPage').css('display', 'flex');
        ajaxRankResult();
        rankToggle = false;
    } else {
        $('#rankPage').css('display', 'none');
        rankToggle = true;
    }
});
//ajax
function ajaxRankResult() {
    let inputScore = scoreValue;
    $.ajax({
        url: "/score",
        type: "POST",
        datatype: "JSON",
        data: { "inputScore": inputScore, "userName": userName }
    })
        .done((json) => {
            let idArray = json.idArray;
            let bestScoreArray = json.bestScoreArray;
            let tempUserScore = '';
            let arrayLength = json.idArray.length;
            tempUserScore += '<div class="rankTitle">';
            tempUserScore += '<div class="rankTitle1">RANK</div>';
            tempUserScore += '<div class="rankTitle2">ID</div>';
            tempUserScore += '<div class="rankTitle3">최고 점수</div>';
            tempUserScore += '</div>';
            for (let i = 0; i < arrayLength; i++) {
                tempUserScore += '<div class="userRank" id="userRank">';
                tempUserScore += `<div class="userRank1">${i + 1}</div>`;
                tempUserScore += `<div class="userRank2">${idArray[i]}</div>`;
                tempUserScore += `<div class="userRank3">${changeValue(bestScoreArray[i])}</div>`;
                tempUserScore += '</div>';
            }
            $('.rankBox').html(tempUserScore);
        })
        .fail((xhr, status, errorThrown) => {
            console.log('ajax failed');
        })
}