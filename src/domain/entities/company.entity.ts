export class Company {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly cnpj: string,
    public readonly tradeName: string,
    public readonly address: string,
    public readonly favorite: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    name: string,
    cnpj: string,
    tradeName: string,
    address: string,
    favorite: boolean = false,
  ): Company {
    const now = new Date();
    return new Company(
      0,
      name,
      cnpj,
      tradeName,
      address,
      favorite,
      now,
      now,
    );
  }

  update(data: Partial<{
    name: string;
    cnpj: string;
    tradeName: string;
    address: string;
    favorite: boolean;
  }>): Company {
    return new Company(
      this.id,
      data.name ?? this.name,
      data.cnpj ?? this.cnpj,
      data.tradeName ?? this.tradeName,
      data.address ?? this.address,
      data.favorite ?? this.favorite,
      this.createdAt,
      new Date(),
    );
  }

  isFavorite(): boolean {
    return this.favorite;
  }

  getDisplayName(): string {
    return this.tradeName || this.name;
  }
}
