-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "firstName" TEXT,
    "lastName" TEXT,
    "passwordResetRequired" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Hour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "validatedById" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Hour_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hour_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClubSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'settings',
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
