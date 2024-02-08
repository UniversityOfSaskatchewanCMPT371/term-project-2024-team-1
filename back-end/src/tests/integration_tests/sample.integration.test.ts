import { A } from "./A";
import { B } from "./B";

describe("Integration Sample: Class/component name test", () => {
  describe("Class/component method test", () => {
    it("Class component method test case: should do something based on something", () => {
      const bObj: B = new B();
      const spyOnA: any = jest.spyOn(A.prototype, "returnABoolean");

      bObj.callHitsA(true);
      expect(spyOnA).toHaveBeenCalled();

      for (let i: number = 0; i < 5; i += 1) {
        bObj.callHitsA(true);
      }
      expect(spyOnA).toHaveBeenCalledTimes(6); // 5 from the loop + 1 from the original call
    });

    it("Mocking implementation", () => {
      const bObj: B = new B();

      expect(bObj.callHitsA(true)).toBeTruthy();


      const spyOnBMethod: jest.SpyInstance = jest.spyOn(bObj, "callHitsA").mockReturnValue(false);
      // The expect below is blantly wrong, but as you can see, we manipulated the return value via mocking.
      expect(bObj.callHitsA(true)).toBeFalsy();

      spyOnBMethod.mockRestore();
    });

    it("Mocking input and oiutput", () => {
      const bObj: B = new B();
      let result: number = bObj.bSumInvolvesA(5, 5);
      expect(result).toEqual(35);

      const spyOnBMethod: jest.SpyInstance = jest.spyOn(A.prototype, "returnMultiplication").mockReturnValueOnce(500);
      result = bObj.bSumInvolvesA(5, 5);
      // The expect below is blantly wrong, but as you can see, we manipulated the return value via mocking.
      expect(result).toEqual(510);

      spyOnBMethod.mockRestore();
    });
  });
});
