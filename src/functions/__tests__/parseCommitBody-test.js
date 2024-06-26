const parseCommitBody = require("../parseCommitBody.js");

describe("parseCommitBody", () => {
  describe("no matches", () => {
    it("returns empty array for empty string", () => {
      expect(parseCommitBody()).toEqual([]);
    });

    it("returns empty array for non matching string", () => {
      expect(parseCommitBody("foobar")).toEqual([]);
    });

    it("returns empty array for miss-formatted issue", () => {
      expect(parseCommitBody("foobar ISSUE12345")).toEqual([]);
    });
  });

  describe("single matches", () => {
    it("returns correct match for single issue (closes)", () => {
      expect(parseCommitBody("closes ISSUE-12345")).toEqual(["ISSUE-12345"]);
    });

    it("returns correct match for single issue (Closes)", () => {
      expect(parseCommitBody("Closes ISSUE-12345")).toEqual(["ISSUE-12345"]);
    });
    it("returns correct match for single issue (close)", () => {
      expect(parseCommitBody("close ISSUE-12345")).toEqual(["ISSUE-12345"]);
    });

    it("returns correct match for single issue (Close)", () => {
      expect(parseCommitBody("Close ISSUE-12345")).toEqual(["ISSUE-12345"]);
    });

    it("returns correct match for single issue (Updates)", () => {
      expect(parseCommitBody("Updates ISSUE-12345")).toEqual(["ISSUE-12345"]);
    });

    it("returns correct match for single issue (resolve)", () => {
      expect(parseCommitBody("resolves ISSUE-12345")).toEqual(["ISSUE-12345"]);
    });

    it("returns correct match for single issue (fix)", () => {
      expect(parseCommitBody("fix: ISSUE-12345 - wow this worked")).toEqual(["ISSUE-12345"]);
    });

    it("returns correct match for single issue (fix) with brackets ", () => {
      expect(parseCommitBody("fix: [MVP-505] change csv separator to semicolon (#316)")).toEqual(["MVP-505"]);
    });

    it("returns correct match for single issue (fix) with brackets ", () => {
      expect(parseCommitBody("feat: MVP-572 Upload all mastered files of an album (#327)")).toEqual(["MVP-572"]);
    });

    it("returns correct match for single issue (fix) with brackets ", () => {
      expect(parseCommitBody("fix: MVP-506 Cadenzabox export track description with tags (#320)")).toEqual(["MVP-506"]);
    });

    it("returns correct match for single issue with body (close)", () => {
      expect(
        parseCommitBody("lorem ipsum\nlorem\n\nclose ISSUE-12345")
      ).toEqual(["ISSUE-12345"]);
    });

    it("returns correct match for single issue with body (Closes)", () => {
      expect(
        parseCommitBody("lorem ipsum\nlorem\n\nCloses ISSUE-12345")
      ).toEqual(["ISSUE-12345"]);
    });
  });

  describe("multiple matches", () => {
    it("returns correct matches for multiple issues (,) with body containing 'updates'", () => {
      expect(
        parseCommitBody(
          "lorem ipsum updates the door\nlorem\n\nupdates ISSUE-12345, Closes ISSUE-23456"
        )
      ).toEqual(["ISSUE-12345", "ISSUE-23456"]);
    });

    it("returns correct matches for multiple issues ( ) with body containing 'resolves'", () => {
      expect(
        parseCommitBody(
          'lorem ipsum resolves the door\nlorem\n\nresolves "ISSUE-12345" Closes ISSUE-23456'
        )
      ).toEqual(["ISSUE-12345", "ISSUE-23456"]);
    });

    it("returns correct matches for multiple issues (\\n) with body containing 'closes'", () => {
      expect(
        parseCommitBody(
          "lorem ipsum closes the door\nlorem\n\ncloses ISSUE-12345\nCloses ISSUE-23456"
        )
      ).toEqual(["ISSUE-12345", "ISSUE-23456"]);
    });

    it("returns correct matches for quoted issues", () => {
      expect(
        parseCommitBody(
          `lorem ipsum closes the door\nlorem\n\ncloses "ISSUE-12345" Closes ISSUE-23456`
        )
      ).toEqual(["ISSUE-12345", "ISSUE-23456"]);
    });
  });

  describe("special cases", () => {
    it("can handle issue references at any place in string issue references", () => {
      expect(
        parseCommitBody(
          "lorem ipsum closes the door\nlorem\n\ncloses ISSUE-12345, ISSUE-23456"
        )
      ).toEqual(["ISSUE-12345", "ISSUE-23456"]);
    });

    it("can handle (multiple) empty lines in message", () => {
      expect(
        parseCommitBody(
          "lorem ipsum\n\ncloses the\n\ndoor\n\n\nResolves ISSUE-12345"
        )
      ).toEqual(["ISSUE-12345"]);
    });

    it("does not match trailing dots", () => {
      expect(
        parseCommitBody(
          "lorem ipsum\n\ncloses the\n\ndoor\n\n\nclose ISSUE-12345."
        )
      ).toEqual(["ISSUE-12345"]);
    });

    it("does work with keyword: issue (colon)", () => {
      expect(
        parseCommitBody(
          "lorem ipsum\n\ncloses the\n\ndoor\n\n\nclose: ISSUE-12345."
        )
      ).toEqual(["ISSUE-12345"]);
    });
  });
});
