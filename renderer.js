import { effect } from "./signals.js"


const codeRegex = /\{([^}]+)\}/g

/**
 * @param {Node} el 
 * @param {(code: string, node: Node) => any} evaluator 
 */
export function traverseTextNodes(el, evaluator) {
    traverseAllChildren(el, (child) => {

        // TEXT CONTENT
        codeRegex.lastIndex = 0 // reset regex
        if (child.nodeType === 3
            && child.textContent
            && codeRegex.test(child.textContent)) {

            const elementTemplate = child.textContent

            effect(() => {
                codeRegex.lastIndex = 0 // reset regex
                let render = elementTemplate
                for (const match of elementTemplate.matchAll(codeRegex)) {
                    let result = evaluator(match[1], child)
                    if (result instanceof Function)
                        result = result()
                    render = render.replace(match[0], result)
                }
                child.textContent = render
            })
        }
    })
}

/**
 * @param {Node} el 
 * @param {(code: string, node: Node, attr: Attr) => any} evaluator 
 */
export function traverseAttributes(el, evaluator) {
    traverseAllChildren(el, (child) => {

        // ATTRIBUTES
        if (child instanceof HTMLElement) {
            for (const attr of child.attributes) {
                codeRegex.lastIndex = 0 // reset regex
                if (!codeRegex.test(attr.value))
                    continue;

                const attrTemplate = attr.value
                effect(() => {
                    codeRegex.lastIndex = 0 // reset regex
                    let render = attrTemplate
                    for (const match of attrTemplate.matchAll(codeRegex)) {
                        let result = evaluator(match[1], child, attr)
                        if (result instanceof Function)
                            result = result()
                        render = render.replace(match[0], result)
                    }
                    attr.value = render
                })
            }
        }
    })
}


/**
 * 
 * @param {Node} node 
 * @param {(node: Node) => void} func 
 */
export function traverseAllChildren(node, func) {
    if (func)
        func(node);
    if (node.childNodes)
        for (let child of node.childNodes)
            traverseAllChildren(child, func);
}