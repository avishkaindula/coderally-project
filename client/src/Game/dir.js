export class Dir{
    static #None = 0;
    static #UP = 1;
    static #DOWN = 2;
    static #LEFT = 3;
    static #RIGHT = 4

    static getUp(){
        return Dir.#UP;
    }

    static getDown() {
        return Dir.#DOWN;
    }

    static getRight() {
        return Dir.#RIGHT;
    }

    static getLeft () {
        return Dir.#LEFT;
    }

    static getNone() {
        return Dir.#None;
    }
}