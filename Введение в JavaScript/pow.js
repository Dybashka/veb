function pow(x, n){
    let result = x;
    for (let i = 1; i<n; i++) result *= x;
    return result;
}

document.write("<p>" + pow(5, 2) + "</p>");