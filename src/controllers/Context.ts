
import { provide, createContext, ContextProvider } from "@lit/context";
import WordData, { WordDataFactory } from "../data/WordData";
import MovieData, { MovieDataFactory } from "../data/MovieData";

export const contextWordData = createContext<WordData>(Symbol('WordData'));

export const contextMovieData = createContext<MovieData>(Symbol('MovieData'));

export class AppContexts {
    
}

export async function setupContexts(): Promise<AppContexts> {


    return null;
}