
export interface IEmitEventOptions extends EventInit {}

const DefaultEmitEventOptions: IEmitEventOptions = {
    bubbles: true,
    composed: true,
    cancelable: true,
};

/**
 * Sends out a custom event from the given element
 * @param el - The element to send the event from
 * @param eventName - The name of the event
 * @param detail - The detail object to send with the event
 * @param options - The options for the event
 */
export function emit(el: HTMLElement, eventName: string, detail: any, options?: IEmitEventOptions) {
    options = {
        ...DefaultEmitEventOptions,
        ...options
    };
    const event = new CustomEvent(eventName, { ...options, detail });
    el.dispatchEvent(event);
}

/**
 * Event delegation helper
 * @param e - The event
 * @param selector - Events will be handled only from elements that match the selector
 * @param handler - Handler to invoke upon selector match
 * @returns 
 */
export function delegate(e: Event, selector: string, handler: (e: Event) => void) {
    if(e.target === e.currentTarget) {
        return;
    }
    const target = e.target as HTMLElement;
    if(target.matches(selector)) {
        handler(e);
    }
}