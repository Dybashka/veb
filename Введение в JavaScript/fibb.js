function  fibb(n){
    let a = 0;
    let b = 1;
    for (let i=n-2; i>0; i--)
    {
        fib_n = a + b;
        a = b;
        b = fib_n;
    }
    return fib_n;
}

document.write("<p>" + fibb(10) + "</p>");