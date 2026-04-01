import { FileSystemFactory } from "@hoge1e3/sfile";
import * as fs from "fs";
import * as path from "path";
export const FS=new FileSystemFactory({
    Buffer: Uint8Array as any,
    fs, path,
})