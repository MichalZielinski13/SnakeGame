class Samochód {
  odpalKierunkowskaz() {
    console.log("AWARIA SYSTEMU. NIE ZNALEZIONO FUNKCJI");
  }
  rusz() {
    console.log("Na spokojnie powolutku.");
  }
  hamuj() {
    console.log("Hamujemy delikatnie jak z dziewczyną na pierwszej randce");
  }
}

class BMW extends Samochód {
  rusz() {
    console.log("I cyk jak solaris na ręcznym");
  }
}

class OPEL extends Samochód {
  odpalKierunkowskaz() {
    console.log("Na chuj. Żarówki drogie.");
  }
  po0brotachJakSkurwysyn() {
    console.log("Obrotomierz jest jak wiatrak. Wskazówka musi latać dookoła.");
  }
}

const mojBMW = new BMW();
console.log(mojBMW);
mojBMW.odpalKierunkowskaz();
mojBMW.rusz();

const mojOPEL = new console.log(mojOPEL);
mojOPEL.odpalKierunkowskaz();
mojOPEL.poobrotachJakSkurwysyn();
