import {
    cleanup,
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import EditArtist from ".";
import { ContextsWrapper, mockedApi } from "../../tests/utils";

afterEach(cleanup);
describe("Edit informations from artists", ()=>{
    afterEach((()=>{mockedApi.reset()}));
    
    test("Editar informação de artista com sucesso", async ()=>{
        const alertMock = jest.spyOn(window, "alert").mockImplementation();
        const pessoa = {
            name : "Test",
            email: "teste@email.com",
            country: "Brasil",
            genre: "Rock",
            image: ""
        }
        mockedApi.onGet("/artists/").reply(200, pessoa)
        
            render(
            <ContextsWrapper>
                <EditArtist />
            </ContextsWrapper>
        );

        const nameTarget = screen.getByDisplayValue("Nome")
        const countryTarget = screen.getByDisplayValue("País")
        const genreTarget = screen.getByDisplayValue("Estilo Musical")

        fireEvent.change(nameTarget, {target: {value: pessoa.name}})
        fireEvent.change(countryTarget, {target: {value: pessoa.country}})
        fireEvent.change(genreTarget, {target: {value: pessoa.genre}})
        
        expect(nameTarget.value).toBe(pessoa.name)
        expect(countryTarget.value).toBe(pessoa.country)
        expect(genreTarget.value).toBe(pessoa.genre)

        mockedApi.onPut("/artists/").reply(200, pessoa)
        fireEvent.click(screen.getByRole("button"));


        await waitFor(() =>{
            expect(alertMock).toHaveBeenCalledTimes(1);
        });
        expect(alertMock).toHaveBeenCalledWith("Deu certo");
    })

    test("Editar informação de artista com Falha", async ()=>{
        const alertMock = jest.spyOn(window, "alert").mockImplementation();
        const pessoa = {
            name : "Test",
            email: "teste@email.com",
            country: "Brasil",
            genre: "Rock",
            image: ""
        }
        mockedApi.onGet("/artists/").reply(200, pessoa)
        
            render(
            <ContextsWrapper>
                <EditArtist />
            </ContextsWrapper>
        );

        const nameTarget = screen.getByDisplayValue("Nome")
        const countryTarget = screen.getByDisplayValue("País")
        const genreTarget = screen.getByDisplayValue("Estilo Musical")

        fireEvent.change(nameTarget, {target: {value: ""}})
        fireEvent.change(countryTarget, {target: {value: pessoa.country}})
        fireEvent.change(genreTarget, {target: {value: pessoa.genre}})
        
        expect(nameTarget.value).toBe("")
        expect(countryTarget.value).toBe(pessoa.country)
        expect(genreTarget.value).toBe(pessoa.genre)

        mockedApi.onPut("/artists/").reply(400, {error: "You can't have empty fields"});
        fireEvent.click(screen.getByRole("button"));


        await waitFor(() =>{
            expect(alertMock).toHaveBeenCalledTimes(1);
        });
        expect(alertMock).toHaveBeenCalledWith("Algo deu errado");
    })
})