export class CostCalculator {
  baseNannyHourlyPay: number;
  taxesAndInsuranceMargin: number;
  overheadMargin: number;
  totalNannyHourlyPay: number;
  totalHours: number;
  hourMultiplier: number;
  totalKids: number;
  tierMultiplier: number;
  totalInfants: number;
  totalNannies: number;
  baseCost: number;
  clientSubtotal: number;

  constructor(totalKids: number, totalInfants: number, totalHours: number) {
    this.totalKids = totalKids;
    this.totalInfants = totalInfants;
    this.baseNannyHourlyPay = 18.0;
    this.taxesAndInsuranceMargin = 1.2;
    this.overheadMargin = 1.3;
    this.totalNannyHourlyPay =
      this.baseNannyHourlyPay *
      this.taxesAndInsuranceMargin *
      this.overheadMargin;
    this.totalHours = totalHours;

    this.hourMultiplier = this.getHourMultiplier;
    this.tierMultiplier = this.getTierMultiplier;
    this.totalNannies = this.getTotalNannies;

    this.baseCost =
      this.totalHours * this.totalNannyHourlyPay * this.totalNannies;
    this.clientSubtotal = Math.round(
      this.baseCost +
        this.baseCost * this.hourMultiplier +
        this.baseCost * this.tierMultiplier
    );
  }

  get getHourMultiplier() {
    if (this.totalHours < 4) {
      return 0.5;
    } else if (this.totalHours >= 4 && this.totalHours < 5) {
      return 0.5;
    } else if (this.totalHours >= 5 && this.totalHours < 6) {
      return 0.475;
    } else if (this.totalHours >= 6 && this.totalHours < 7) {
      return 0.45;
    } else if (this.totalHours >= 7 && this.totalHours < 8) {
      return 0.425;
    } else if (this.totalHours >= 8 && this.totalHours < 9) {
      return 0.4;
    } else if (this.totalHours >= 9 && this.totalHours < 10) {
      return 0.375;
    } else if (this.totalHours >= 10) {
      return 0.35;
    } else {
      return 0.5;
    }
  }

  get getTierMultiplier() {
    if (this.totalKids >= 1 && this.totalKids <= 4) {
      return 0;
    } else if (this.totalKids >= 5 && this.totalKids <= 8) {
      return 0.1;
    } else if (this.totalKids >= 9 && this.totalKids <= 15) {
      return 0.15;
    } else if (this.totalKids >= 16) {
      return 0.2;
    } else {
      return 0;
    }
  }

  get getTotalNannies() {
    const kidsOver18Months = this.totalKids - this.totalInfants;
    const nanniesForOver18 = Math.ceil(kidsOver18Months / 4);
    const nanniesForInfants = this.totalInfants;
    const total = Math.max(2, nanniesForOver18 + nanniesForInfants);
    return total;
  }
}

// Profit Margin Multiplier
// 4 hours - 1.5
// 5 hours - 1.475
// 6 hours - 1.45
// 7 hours - 1.425
// 8 hours - 1.4
// 9 hours - 1.375
// 10 hours - 1.35

// Tier Multiplier
// Petite (1-4)- 1
// Darling (5-8)- 1.1
// Dream (9-15)- 1.15
// Grand (16+)- 1.2

// Input: totalkids, 18younger, hours (4min, 10max)

// petite 1-4
// darling 5-8
// dream 9-15
// grand 16+ (call and pay deposit, custom quote required.)

// base nanny hourly pay 18/hr

// taxes and insurance 20%
// overhead 30%

// true cost: 28.08/hr

// auto calc nannys (they want it to show the number of nanny’s they will get)

// min 2 nannys, round up 2 (totalnumberofkids-numberofkidsunder18) / 4 — + numberof kinds under 18 months

// for every 4 kids over 18 months, 1 nanny, and for every kid under 18 months, its 1 nanny.

// base cost: hours x 18 + 20% + 30% (28.08) x nannys

// cliend base price = basecost * profit margin id

// address bounds utah county / salt lake county

// is the wedding at 1 single location?
// yes:
// is there a reception? where?

// moving fee? — talk to sara and answer this question.

// if their doing 2 locations ask for date time, 10 hour max still does apply.

// 7:00 am - 11:00 pm
