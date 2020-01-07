let wrap = document.getElementsByClassName('wrapper')[0];
let rows = 7;   // 创建连连看行数
let cols = 12;  // 创建连连看列数
let type = 25;   //选择多少种图片，0-24都可以   数字大种类多  数字小种类少游戏难度更简单
let squareSet = [];    // 生成小方块的数组
let chooseOne = null; //
let chooseTwo = null; //
let startTime = null;
window.onload = function () {
    init(); //初始化
};

function init() {
    //小屏幕自动适配
    cols = Math.floor(window.innerWidth / 80);
    //小屏幕自动适配
    rows = Math.floor((window.innerHeight - 100) / 80);
    if (rows * cols % 2 !== 0) { //判断小方块总数是否为奇数，奇数就不执行
        rows--;
    }

    initSquareSet();
}

function initSquareSet() {
    // 方块默认长宽都是80px
    wrap.style.height = rows * 80 + 'px';   // 外面盒子的总高度
    wrap.style.width = cols * 80 + 'px';  // 外面盒子的总宽度

    let tmp = createRandomNum();  //生成随机数数组   我的图片名称是0.jpg~24.jpg 函数生成0~24随机数就可以通过字符串拼接动态的选择图片

    squareSet = new Array(rows + 2);  // 生成小方块的数组   既有行又有列  我们就要利用for循环生成二维数组 57~60
    for (let i = 0; i < squareSet.length; i++) {
        squareSet[i] = new Array(cols + 2);
    }

    for (let i = 0; i < rows; i++) {  // 生成行数
        for (let j = 0; j < cols; j++) { // 生成列数 同理
            let temp = createSquare(tmp.pop(), i, j); // 参数每次取随机数数组的最后一位  i小方块在整体中行的位置j是列的位置   temp接收这个返回的DOM元素
            squareSet[i][j] = temp;
            wrap.append(temp);
            temp.onclick = function () {
                if (!startTime) startTime = new Date().getTime();//首次点击
                if (chooseOne == null || chooseOne.num !== this.num) {   // 判断是第一次点击还是第二次 77~81 没有值或者说没有属性的都是第一次点击
                    chooseOne = this;
                } else {
                    chooseTwo = this;
                    if (chooseOne !== chooseTwo && chooseOne.num === chooseTwo.num) { //判断第一次和第二次点击不是同一个 并且num值相等  以及是否在路径上可以消除
                        clearSquare(chooseOne.row, chooseOne.col);
                        clearSquare(chooseTwo.row, chooseTwo.col);
                    }
                    chooseOne = null;
                    chooseTwo = null;
                    if (wrap.children.length === 0) {
                        let text = time();
                        alert('恭喜,游戏结束!用时: ' + text + ' !!!');
                        save({time: new Date().toLocaleDateString(), score: text});
                        startTime = null;
                        init();
                    }
                }
                render(); // 点击方块变换样式
            }
        }
    }
}

function time() {
    let len = Math.floor((new Date().getTime() - startTime) / 1000);
    if (len < 60) {
        return len + ' 秒';
    } else {
        return Math.floor(len / 60) + '分 ' + (len % 60) + '秒';
    }
}

function createRandomNum() {
    let tmp = []; // 存放生成图片是  字符串拼接的数字

    // rows * cols 可以算出需要多少张图片 然后除以2 因为每张图片都是成对出现的  即 7*12=84张图片  84/2=41算出有42对
    for (let i = 0; i < rows * cols / 2; i++) {
        let num = Math.floor(Math.random() * type); // 生成0~24的随机数
        tmp.push(num);
        tmp.push(num); // 循环了42次  所以push两遍 相当如每次push了相同的一对数，42次 正好84张图片
    }
    // console.log(tmp);  // 看看生成的数组  可以看到成对的随机数字数组
    tmp.sort(function () {
        return Math.random() - 0.5  //可以打乱数组
    });
    // console.log(tmp); // 看看生成的数组  可以看到已经不成对的随机数字数组
    return tmp           // 将数组返回回去

}

function createSquare(num, row, col) {

    let temp = document.createElement('div');
    temp.classList.add('square');
    temp.style.backgroundImage = "url('./img/" + num + ".jpg')";
    temp.style.top = row * 80 + 'px'; // 生成方块的位置 96,97
    temp.style.left = col * 80 + 'px';
    temp.num = num; //设置小方块的随机数属性 到时候可以用来判断属性是否一样来判断是否消除小方块
    temp.row = row;
    temp.col = col;
    return temp;   //返回了一个带着属性的DOM元素
}

function render() {
    for (let i = 0; i < squareSet.length; i++) {  //做一个样式的切换
        for (let j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j] && squareSet[i][j] === chooseOne) {
                squareSet[i][j].style.opacity = '0.5';
            } else if (squareSet[i][j]) {
                squareSet[i][j].style.opacity = '1';
            }
        }
    }
}

function clearSquare(x, y) {
    wrap.removeChild(squareSet[x][y]); // 删除方块
    squareSet[x][y] = null;
}

document.getElementsByClassName('leader-board')[0].addEventListener('click', function () {
    if (document.getElementsByClassName('leader-board-wrapper')[0].style.display === 'block') {
        document.getElementsByClassName('leader-board-wrapper')[0].style.display = 'none';
        document.getElementsByClassName('wrapper')[0].style.display = 'block';
    } else {
        document.getElementsByClassName('leader-board-wrapper')[0].style.display = 'block';
        document.getElementsByClassName('wrapper')[0].style.display = 'none';
    }
});
//保存数据
let localStorageKey = 'pengsea.game.lianliankan';

function save(item) {
    let obj = JSON.parse(localStorage.getItem(localStorageKey));
    if (obj && obj.leaderboard) {
        obj.leaderboard.push(item)
    } else {
        obj.leaderboard = [item];
    }
    localStorage.setItem(localStorageKey, JSON.stringify(obj));
}
