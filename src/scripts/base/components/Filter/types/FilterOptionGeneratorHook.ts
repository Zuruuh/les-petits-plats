/**
 * A filter generator is a hook which is called every time the {@see Search}
 * iterates over a single filtrable item. The filtrable will be passed
 * to the hook which will be in charge of returning the options that will
 * be displayed to the end user using the {@see Filter} component.
 *
 * The {@see Search} component will make sure none of the options returned
 * is displayed twice so the hook function does not have to care about that.
 */
export type FilterOptionGeneratorHook<T> = (filtrable: T) => string | string[];
