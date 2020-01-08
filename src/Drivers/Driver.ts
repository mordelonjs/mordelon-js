export abstract class Driver {

    abstract async load(options: object): Promise<Object[]>

    register(name: string) {
        global.Mordelon.DriverManager.register(name, this);
    }
}