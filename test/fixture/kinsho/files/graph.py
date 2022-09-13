import pandas
import matplotlib.pyplot as  plt

df=pandas.read_table("log_1.txt",sep=",",header=None)

lose_2=df[df[4]==2]
lose_1=df[df[4]==1]

print ("1lose 2win", len(lose_1))
print ("1win 2lose",len(lose_2))

plt.scatter(lose_2[0],lose_2[2], color="blue", s=3,label="1win 2lose")
plt.scatter(lose_1[0],lose_1[2], color="red", s=3,label="1lose 2win")
plt.legend()
plt.xlabel("total time of player 1(ms)")
plt.ylabel("total time of player 2(ms)")
plt.savefig("totaltimes.png")
plt.clf()

plt.scatter(lose_2[1],lose_2[3], color="blue", s=3, label="1win 2lose")
plt.scatter(lose_1[1],lose_1[3], color="red", s=3, label="1lose 2lose")
plt.legend()
plt.xlabel("timeout of player 1(ms)")
plt.ylabel("timeout of player 2(ms)")
plt.savefig("timeouts.png")
plt.clf()


plt.scatter(lose_1[0]/lose_1[1],lose_1[2]/lose_1[3], color="red", s=1, label="1lose 2win")
plt.scatter(lose_2[0]/lose_2[1],lose_2[2]/lose_2[3], color="blue", s=1, label="1win 2lose")
plt.legend()
plt.xlabel("iterations of player 1")
plt.xscale('log')
plt.ylabel("iterations of player 2")
plt.yscale('log')
plt.savefig("iterations.png")
plt.clf()


