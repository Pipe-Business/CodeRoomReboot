export interface GptCodeInfoEntity {
    title: string,
    category: string,
    language: string,
    readMe: string,
    aiSummary: string,
    hashTag?: string[],
    githubRepoUrl: string,
}