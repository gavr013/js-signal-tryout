import { computed, createSignal, effect } from './signals.js'

document.addEventListener('DOMContentLoaded', main)

function main() {
    const el = document.querySelector('body')
    if (!el)
        throw new Error()

    const [hello, setHello] = createSignal('default')
    const [world, setWorld] = createSignal('default')
    const [counter, setCounter] = createSignal(0)

    const helloWorld = computed(() => `${hello()}, ${world()}!`)

    effect(() => {

        el.innerHTML = `${helloWorld()}! ${counter()}`

    })

    setTimeout(() => {

        setHello("Hello")
        setWorld("World")

    }, 500)

    setInterval(() =>
        setCounter(counter() + 1),
        1000)
}
