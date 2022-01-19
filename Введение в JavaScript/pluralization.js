function pluralizeRecords(n){
    let x = "запис";
    if (n % 10 == 1) x += "ь";

}

document.write("<p>" + pluralizeRecords(5) + "</p>");