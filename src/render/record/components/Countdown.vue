<template>
    <div class="demo">
        <div class="demo__colored-blocks">
            <div class="demo__colored-blocks-rotater">
                <div class="demo__colored-block" />
                <div class="demo__colored-block" />
                <div class="demo__colored-block" />
            </div>
            <div class="demo__colored-blocks-inner" />
            <div class="demo__text">
                Ready
            </div>
        </div>
        <div class="demo__inner">
            <svg class="demo__numbers" viewBox="0 0 100 100">
                <defs>
                    <path class="demo__num-path-1" d="M40,28 55,22 55,78" />
                    <path class="demo__num-join-1-2" d="M55,78 55,83 a17,17 0 1,0 34,0 a20,10 0 0,0 -20,-10" />
                    <path class="demo__num-path-2" d="M69,73 l-35,0 l30,-30 a16,16 0 0,0 -22.6,-22.6 l-7,7" />
                    <path class="demo__num-join-2-3" d="M28,69 Q25,44 34.4,27.4" />
                    <path class="demo__num-path-3" d="M30,20 60,20 40,50 a18,15 0 1,1 -12,19" />
                </defs>
                <path
                    class="demo__numbers-path" d="M-10,20 60,20 40,50 a18,15 0 1,1 -12,19
               Q25,44 34.4,27.4
               l7,-7 a16,16 0 0,1 22.6,22.6 l-30,30 l35,0 L69,73
               a20,10 0 0,1 20,10 a17,17 0 0,1 -34,0 L55,83
               l0,-61 L40,28"
                />
            </svg>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "sass:math";

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

$bgColor: #32386D;

$numOfColBlocks: 3; // must be higher than 2
$deg: math.div(360deg, $numOfColBlocks);

$red: #FD3359;
$yellow: #F4D302;
$blue: #21BDFF;

$blocksColors: (
  1: $red,
  2: $yellow,
  3: $blue
);

$size: 140px;
$sizeBig: 500px;
$pad: 10px;
$numSize: 100px;
$totalAT: 4s;
$contBr: 20px;

$num1Len: 72.1554946899414;
$num2Len: 136.02162170410156;
$num3Len: 144.4256591796875;
$numJoin1-2: 82.63925170898438;
$numJoin2-3: 42.81303787231445;
$numJoin3-0: 40;

$totalLen: $num1Len + $num2Len + $num3Len + $numJoin1-2 + $numJoin2-3 + $numJoin3-0;

body {
  background: $bgColor;
  font-family: Helvetica, Arial, sans-serif;
}

.demo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: $sizeBig;
  height: $size;
  margin-top: calc(#{$size} / -2);
  padding: $pad;
  border-radius: 20px;
  transform: translateX(calc(#{$sizeBig} / -2));

  &__colored-blocks {
    overflow: hidden;
    position: absolute;
    left: 50%;
    top: 0;
    width: $sizeBig;
    height: 100%;
    margin-left: calc(#{$sizeBig} / -2);
    padding: $pad;
    border-radius: $contBr;
    perspective: 1000px;
    animation: demoAnim $totalAT ease-in-out forwards, contAnim $totalAT forwards;

    &-rotater {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      animation: rotation 1.3s linear forwards;
    }

    &-inner {
      overflow: hidden;
      position: relative;
      height: 100%;
      background: $bgColor;
      border-radius: inherit;
    }
  }

  &__colored-block {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300%;
    height: 300%;
    transform-origin: 0 0;

    @for $i from 1 through $numOfColBlocks {
      &:nth-child(#{$i}) {
        $rt: $deg * ($i - 1);
        $skew: 90deg - $deg;
        transform: rotate($rt) skewX($skew);
        background-color: map-get($blocksColors, $i);
      }
    }
  }

  &__inner {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__numbers {
    overflow: visible;
    position: absolute;
    left: 50%;
    top: 50%;
    width: $numSize;
    height: $numSize;
    margin-left: calc(#{$numSize} / -2);
    margin-top: calc(#{$numSize} / -2);

    &-path {
      fill: none;
      stroke-width: 10px;
      stroke: #fff;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 0, $totalLen;
      stroke-dashoffset: 0;
      animation: numAnim $totalAT ease-in-out forwards;
      opacity: 0;
    }
  }

  &__text {
    position: absolute;
    left: 50%;
    top: 0;
    width: $sizeBig;
    height: 100%;
    margin-left: math.div($sizeBig, -2);
    text-align: center;
    line-height: $size;
    font-size: 100px;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 15px;
    transform: translateX(10px);
    animation: hideText $totalAT forwards;
  }
}

@keyframes contAnim {
  15%,
  100% {
    margin-left: math.div($sizeBig, -2);
    width: $sizeBig;
  }

  25%,
  90% {
    margin-left: math.div($size, -2);
    width: $size;
  }
}

@keyframes numAnim {
  15% {
    stroke-dasharray: 0, $totalLen;
    stroke-dashoffset: 0;
    opacity: 0;
  }

  25%,
  41% {
    opacity: 1;
    stroke-dasharray: $num3Len, $totalLen;
    stroke-dashoffset: math.div(-$num3Len - $numJoin2-3 - $numJoin3-0, 1);
  }

  53%,
  66% {
    stroke-dasharray: $num2Len, $totalLen;
    stroke-dashoffset: math.div(-$num3Len - $numJoin2-3 - $num2Len - $numJoin1-2 - $numJoin3-0, 1);
  }

  76% {
    stroke-dasharray: $num1Len + math.div($numJoin1-2, 2), $totalLen;
    stroke-dashoffset: math.div(-$num3Len - $numJoin2-3 - $num2Len - $numJoin1-2 - $numJoin3-0, 1);
  }

  88%,
  100% {
    stroke-dasharray: $num1Len, $totalLen;
    stroke-dashoffset: (-$num3Len - $numJoin2-3 - $num2Len - $numJoin1-2 - $numJoin3-0, 1);
  }

  92% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes rotation {
  to {
    transform: rotate(360deg);
  }
}

@keyframes demoAnim {
  15% {
    border-radius: $contBr;
    transform: rotate(0);
  }

  30%,
  43% {
    border-radius: 50%;
    transform: rotate(360deg);
  }

  52%,
  65% {
    border-radius: 0;
    transform: rotate(720deg);
  }

  78%,
  90% {
    border-radius: 50%;
    transform: rotate(1080deg);
  }

  100% {
    border-radius: $contBr;
    transform: rotate(1440deg);
  }
}

@keyframes hideText {
  15%,
  100% {
    opacity: 1;
  }

  20%,
  96% {
    opacity: 0;
  }
}
</style>
