function minDigit(x) {
    let min = x;
    while (x > 0)
    {
        let y = x % 10;
        if (min > y) min = y;
        x = Math.trunc(x/10);
    }
    return min;
}

document.write("<p>" + minDigit(1231) + "</p>");