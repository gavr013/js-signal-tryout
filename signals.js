
/**
 * @template T
 * @param {T} deaultValue
 * @returns {[function():T, function(T):void]}
 */
export function createSignal(deaultValue) {
    /**
     * @type {T}
     */

    let value = deaultValue
    let emitter = new EventTarget()

    return [
        () => {
            context?.push(emitter)
            return value
        },
        /**
         * 
         * @param {T} newValue 
         */
        (newValue) => {
            const changed = value !== newValue
            value = newValue
            if (changed)
                emitter.dispatchEvent(new CustomEvent('updated'))
        },
    ]
}

/**
 * @type {EventTarget[] | null}
 */
let context = null

/**
 * @template T
 * @callback ComputedCallback
 * @return {T}
 */
/**
 * @template T
 * @param {ComputedCallback<T>} callback 
 * @returns 
 */
export function computed(callback) {

    return () => {
        return callback()
    }
}


/**
 * @callback EffectCallback
 * @return {void}
 */
/**
 * 
 * @param {EffectCallback} callback 
 */
export function effect(callback) {
    context = []
    callback()
    for (const emitter of context)
        emitter.addEventListener('updated', callback)
    context = null
}
