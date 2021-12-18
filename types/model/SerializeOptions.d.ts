/**
 * Created by cshao on 2021-10-26.
 */
interface SerializeOptions {
    ignoreProperties?: Array<string>;
    interceptProperties?: Record<string, Function>;
}
export default SerializeOptions;
