import axios from "axios";
import createController from "../controller.js";
import {TV_SHOWS_API_BASE_URL} from "../../../constants.js";

jest.mock("axios");

describe('Shows controller', () => {
    let controller;
    let mockReq
    let mockRes
    let mockData

    beforeEach(() => {
        controller = createController();
        mockRes = {status: jest.fn().mockReturnThis(), send: jest.fn()}
        jest.clearAllMocks();
    })

    it('Should return a list of shows', async () => {
        mockReq = {query: {search: 'movie'}}
        mockData = [
            {
                score: 1,
                show: {id: '123', name: 'Titanic', genres: ['Drama', 'History']},
            },
            {
                score: 1,
                show: {id: '321', name: 'Star wars', genres: ['Action', 'Science-Fiction']}
            }]
        axios.get.mockResolvedValue({data: mockData})

        await controller.getShows(mockReq, mockRes);

        expect(axios.get).toHaveBeenCalledWith(`${TV_SHOWS_API_BASE_URL}/search/shows`, {
            params: {q: 'movie'}
        });
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith(mockData.map(el => el.show));
    });

    it('Should return full show object by id', async () => {
        mockReq = {params: {id: '123'}}
        mockData = {
            id: '123', name: 'Titanic', genres: ['Drama', 'History'], language: 'English'
        }
        axios.get.mockResolvedValue({data: mockData})

        await controller.getShowById(mockReq, mockRes);

        expect(axios.get).toHaveBeenCalledWith(`${TV_SHOWS_API_BASE_URL}/shows/${mockReq.params.id}`)
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith(mockData);
    });
});