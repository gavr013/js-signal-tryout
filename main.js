import { traverseAttributes, traverseTextNodes } from './renderer.js'
import { computed, createSignal, effect } from './signals.js'


await fetch('./template.html')
    .then(resp => resp.text())
    .then(template => main(template))

/**
 * @param {string} template 
 */
function main(template) {
    const el = document.querySelector('body')
    if (!el)
        throw new Error()

    const [hello, setHello] = createSignal('Hello')
    const [world, setWorld] = createSignal('World')
    const [counter, setCounter] = createSignal(0)
    
    const color = computed(() => counter() % 2 == 1 ? 'cadetblue' : 'darkorchid')
    
    setInterval(() => {
        setCounter(counter() + 1)
    }, 1000)
    
    setInterval(() => {
        setHello(`${counter()} - Hello`)
    }, 1500)
    
    effect(() => {
        document.title = "Signals - " + counter()
    })

    
    const [progress, setProgress] = createSignal(0)
    const loopedProgress = computed(() => progress() % 1)
    const pingPongProgress = computed(() => pingPong(progress()))

    let prevTime = performance.now()
    const updateLoop = () => {
        const dt = (performance.now() - prevTime) / 1000
        prevTime = performance.now()
        setProgress(progress() + 0.8 * dt)
        requestAnimationFrame(updateLoop)
    }
    requestAnimationFrame(updateLoop)


    // RENDER
    el.innerHTML = template
    // eval has the same scope as caller function (main)
    // so it sees signals (as well as everything else in main function and global scope)
    traverseTextNodes(el, code => eval(code))
    traverseAttributes(el, code => eval(code))
}



/**
 * @param {number} x 
 * @returns {number}
 */
function pingPong(x) {
    return Math.round(x - 0.5) % 2 == 1 ? x % 1 : 1 - x % 1
}

/**
 * @description https://easings.net/#easeInOutCubic
 * @param {number} x
 * @returns {number}
 */
function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}