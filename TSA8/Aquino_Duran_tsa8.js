function resetFlex() {
    document.querySelector('.flex-container').style = '';
    document.querySelectorAll('.box').forEach(box => {
        box.style.flexGrow = '0';
        box.style.width = '100px'; 
        box.style.height = '100px'; 
    });
    document.getElementById('gap').value = 0;
    document.getElementById('box1').value = 0;
    document.getElementById('box2').value = 0;
    document.getElementById('box3').value = 0;
}

function updateGap() {
    const gapValue = document.getElementById('gap').value;
    document.querySelector('.flex-container').style.gap = `${gapValue}px`;
}

function setDirection(direction) {
    document.querySelector('.flex-container').style.flexDirection = direction;
}

function setJustify(justifyContent) {
    document.querySelector('.flex-container').style.justifyContent = justifyContent;
}

function setAlign(alignItems) {
    document.querySelector('.flex-container').style.alignItems = alignItems;
}

function resetGrow() {
    document.querySelectorAll('.box').forEach(box => box.style.flexGrow = '0');
}

function growAll() {
    document.querySelectorAll('.box').forEach(box => box.style.flexGrow = '1');
}


function updateGrow(boxNumber) {
    const growValue = document.getElementById('box${boxNumber}').value;
    document.querySelector('.flex-container').style.gap = `${gapValue}px`;
}

updateGap();
