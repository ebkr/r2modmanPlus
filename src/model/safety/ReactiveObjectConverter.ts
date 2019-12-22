/**
 * ReactiveObjectConverter is a utility to convert a "reactive" object to a standard one.
 * The problems lies with reactive objects removing class methods, and providing direct access to fields.
 * This wouldn't usually be a problem, but to keep things type-safe, it's best to ensure that they are actually that type.
 * 
 * If a non-reactive element is passed in, it will fail.
 * ---------------
 * 
 * fromReactive should call fromReactive for any custom classes being used.
 * EG: ThunderstoreMod.versions requires a list of ThunderstoreVersion. So call fromReactive per version, and bind the result.
 * 
 * fromReactive should be used for any model used within a vue file.
 * 
 * 
 */
export default interface ReactiveObjectConverterInterface {
    fromReactive(object: any): any;
}