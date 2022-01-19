function gcd(a, b){
    while(a!=0 && b!=0) 
    {
        if (a>b) a = a%b;
        else  b = b%a;
    }

    return a + b;
}

document.write("<p>" + gcd(12, 16) + "</p>");