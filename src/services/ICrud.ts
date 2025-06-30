export default interface ICrud<TCreate, TRead, TUpdate, TDelete> {
    create(data: TCreate): Promise<any>;
    read(params: TRead): Promise<any>;
    update(params: TUpdate): Promise<any>;
    delete(params: TDelete): Promise<void>;
}