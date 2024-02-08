import { A } from "./A";

export class B {
  public callHitsA(b: boolean): boolean {
    const a: A = new A();
    return a.returnABoolean(b);
  }

  public mutatingCall(): void {
    console.log("Hi, I do nothing.");
  }

  public bSumInvolvesA(x: number, y: number): number {
    const a: A = new A();
    return x + y + a.returnMultiplication(x, y);
  }
}
