const colorDisplay = document.getElementById('colorDisplay');
const colorPicker = document.getElementById('colorPicker');


const rInput = document.getElementById('r');
const gInput = document.getElementById('g');
const bInput = document.getElementById('b');
const rValue = document.getElementById('rValue');
const gValue = document.getElementById('gValue');
const bValue = document.getElementById('bValue');


const cInput = document.getElementById('c');
const mInput = document.getElementById('m');
const yInput = document.getElementById('y');
const kInput = document.getElementById('k');
const cValue = document.getElementById('cValue');
const mValue = document.getElementById('mValue');
const yValue = document.getElementById('yValue');
const kValue = document.getElementById('kValue');


const hInput = document.getElementById('h');
const lInput = document.getElementById('l');
const sInput = document.getElementById('s');
const hValue = document.getElementById('hValue');
const lValue = document.getElementById('lValue');
const sValue = document.getElementById('sValue');


function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + +b).toString(16).slice(1).toUpperCase();
}


function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return {r, g, b};
}


function rgbToCmyk(r, g, b) {
    let rPerc = r / 255;
    let gPerc = g / 255;
    let bPerc = b / 255;

    let k = 1 - Math.max(rPerc, gPerc, bPerc);
    let c = (1 - rPerc - k) / (1 - k) || 0;
    let m = (1 - gPerc - k) / (1 - k) || 0;
    let y = (1 - bPerc - k) / (1 - k) || 0;

    if (k === 1) {
        c = 0;
        m = 0;
        y = 0;
    }

    return {
        c: (c * 100).toFixed(0), m: (m * 100).toFixed(0), y: (y * 100).toFixed(0), k: (k * 100).toFixed(0)
    };
}


function cmykToRgb(c, m, y, k) {
    let r = 255 * (1 - Math.min(1, c / 100)) * (1 - Math.min(1, k / 100));
    let g = 255 * (1 - Math.min(1, m / 100)) * (1 - Math.min(1, k / 100));
    let b = 255 * (1 - Math.min(1, y / 100)) * (1 - Math.min(1, k / 100));

    return {
        r: Math.round(r), g: Math.round(g), b: Math.round(b)
    };
}


function rgbToHls(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let delta = max - min;
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

        switch (max) {
            case r:
                h = (g - b) / delta + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / delta + 2;
                break;
            case b:
                h = (r - g) / delta + 4;
                break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360), l: Math.round(l * 100), s: Math.round(s * 100)
    };
}


function hlsToRgb(h, l, s) {
    l /= 100;
    s /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let hPrime = h / 60;
    let x = c * (1 - Math.abs(hPrime % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= hPrime && hPrime < 1) {
        r = c;
        g = x;
        b = 0;
    } else if (1 <= hPrime && hPrime < 2) {
        r = x;
        g = c;
        b = 0;
    } else if (2 <= hPrime && hPrime < 3) {
        r = 0;
        g = c;
        b = x;
    } else if (3 <= hPrime && hPrime < 4) {
        r = 0;
        g = x;
        b = c;
    } else if (4 <= hPrime && hPrime < 5) {
        r = x;
        g = 0;
        b = c;
    } else if (5 <= hPrime && hPrime < 6) {
        r = c;
        g = 0;
        b = x;
    }

    return {
        r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255)
    };
}


function updateColorDisplay(r, g, b) {
    const hexColor = rgbToHex(r, g, b);
    colorDisplay.style.backgroundColor = hexColor;
    colorPicker.value = hexColor;
}


function updateCmykValues() {
    const c = parseInt(cInput.value);
    const m = parseInt(mInput.value);
    const y = parseInt(yInput.value);
    const k = parseInt(kInput.value);
    cValue.value = c;
    mValue.value = m;
    yValue.value = y;
    kValue.value = k;

    const rgb = cmykToRgb(c, m, y, k);
    rInput.value = rValue.value = rgb.r;
    gInput.value = gValue.value = rgb.g;
    bInput.value = bValue.value = rgb.b;

    const hls = rgbToHls(rgb.r, rgb.g, rgb.b);
    hInput.value = hValue.value = hls.h;
    lInput.value = lValue.value = hls.l;
    sInput.value = sValue.value = hls.s;


    updateColorDisplay(rgb.r, rgb.g, rgb.b);

}


function updateHlsValues() {
    const h = parseInt(hInput.value);
    const l = parseInt(lInput.value);
    const s = parseInt(sInput.value);
    hValue.value = h;
    lValue.value = l;
    sValue.value = s;


    const rgb = hlsToRgb(h, l, s);
    rInput.value = rValue.value = rgb.r;
    gInput.value = gValue.value = rgb.g;
    bInput.value = bValue.value = rgb.b;

    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    cInput.value = cValue.value = cmyk.c;
    mInput.value = mValue.value = cmyk.m;
    yInput.value = yValue.value = cmyk.y;
    kInput.value = kValue.value = cmyk.k;

    updateColorDisplay(rgb.r, rgb.g, rgb.b);

}


function updateRgbValues() {
    const r = parseInt(rInput.value);
    const g = parseInt(gInput.value);
    const b = parseInt(bInput.value);
    rValue.value = r;
    gValue.value = g;
    bValue.value = b;


    const cmyk = rgbToCmyk(r, g, b);
    cInput.value = cValue.value = cmyk.c;
    mInput.value = mValue.value = cmyk.m;
    yInput.value = yValue.value = cmyk.y;
    kInput.value = kValue.value = cmyk.k;

    const hls = rgbToHls(r, g, b);
    hInput.value = hValue.value = hls.h;
    lInput.value = lValue.value = hls.l;
    sInput.value = sValue.value = hls.s;

    updateColorDisplay(r, g, b);
}

function updateOnConfirm(input, updateFunction) {
    input.addEventListener('blur', updateFunction);
    input.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            updateFunction();
        }
    });
}


rInput.addEventListener('input', updateRgbValues);
gInput.addEventListener('input', updateRgbValues);
bInput.addEventListener('input', updateRgbValues);


cInput.addEventListener('input', updateCmykValues);
mInput.addEventListener('input', updateCmykValues);
yInput.addEventListener('input', updateCmykValues);
kInput.addEventListener('input', updateCmykValues);


hInput.addEventListener('input', updateHlsValues);
lInput.addEventListener('input', updateHlsValues);
sInput.addEventListener('input', updateHlsValues);


updateOnConfirm(rValue, () => {
    rInput.value = rValue.value;
    updateRgbValues();
});
updateOnConfirm(gValue, () => {
    gInput.value = gValue.value;
    updateRgbValues();
});
updateOnConfirm(bValue, () => {
    bInput.value = bValue.value;
    updateRgbValues();
});


updateOnConfirm(cValue, () => {
    cInput.value = cValue.value;
    updateCmykValues();
});
updateOnConfirm(mValue, () => {
    mInput.value = mValue.value;
    updateCmykValues();
});
updateOnConfirm(yValue, () => {
    yInput.value = yValue.value;
    updateCmykValues();
});
updateOnConfirm(kValue, () => {
    kInput.value = kValue.value;
    updateCmykValues();
});


updateOnConfirm(hValue, () => {
    hInput.value = hValue.value;
    updateHlsValues();
});
updateOnConfirm(lValue, () => {
    lInput.value = lValue.value;
    updateHlsValues();
});
updateOnConfirm(sValue, () => {
    sInput.value = sValue.value;
    updateHlsValues();
});

colorPicker.addEventListener('input', () => {
    const rgb = hexToRgb(colorPicker.value);
    rInput.value = rValue.value = rgb.r;
    gInput.value = gValue.value = rgb.g;
    bInput.value = bValue.value = rgb.b;
    updateRgbValues();
});